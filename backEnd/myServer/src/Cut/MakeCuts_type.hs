{-# LANGUAGE DeriveGeneric #-}

module Cut.MakeCuts_type
  ( Progress (..),
    defaultProgress,
    JobID,
    Job (..),
    JobState (..),
    clearJobQueue,
    getDone,
    getFailCount,
    getTotal,
    getIsComplete,
    updateState,
    setTotalFrames,
    insertJob,
    mkJob,
    getJob,
    showInfo,
  )
where

import Data.Aeson (ToJSON)
import qualified Data.Map as M
import GHC.Generics (Generic)

data Progress = Progress
  { jobMap :: M.Map JobID Job,
    jobQueue :: [JobID]
  }
  deriving (Show, Eq)

type JobID = Int

data Job = Job
  { videoName :: String,
    state :: JobState, -- Waiting | Processing | Done | Error
    videoDir :: FilePath,
    outputDir :: FilePath,
    totalFrames :: Maybe Int
  }
  deriving (Eq, Generic)

instance Show Job where
  show job =
    "[state: " ++ show (state job)
      ++ "] "
      ++ videoName job

instance ToJSON Job

data JobState = Waiting | Processing | Done | Error deriving (Show, Eq, Generic)

instance ToJSON JobState

clearJobQueue :: Progress -> Progress
clearJobQueue p = p {jobQueue = []}

getDone :: Progress -> Int
getDone (Progress jobMap _) = length $ filter ((== Done) . state) $ M.elems jobMap

getFailCount :: Progress -> Int
getFailCount (Progress jobMap _) = length $ filter ((== Error) . state) $ M.elems jobMap

getTotal :: Progress -> Int
getTotal (Progress jobMap _) = M.size jobMap

getIsComplete :: Progress -> Bool -- 影片都處理完 並且 前端讀取完畢
getIsComplete p@(Progress _ jobQueue) = getDone p + getFailCount p >= getTotal p && null jobQueue

showInfo :: Progress -> String
showInfo p = "[done/total/fail]: " ++ show (getDone p) ++ "/" ++ show (getTotal p) ++ "/" ++ show (getFailCount p)

-- mkProgress :: [Job] -> Progress
-- mkProgress jobArr = Progress { jobMap = M.fromList $ zip [0..] jobArr, jobQueue = [] }

updateState :: JobID -> JobState -> Progress -> Progress
updateState jobID newState p@(Progress jobMap jobQueue) =
  let updateJobState job = job {state = newState}
   in p
        { jobMap = M.adjust updateJobState jobID jobMap, -- 修該對應jobID的值
          jobQueue = jobID : filter (/= jobID) jobQueue -- 加入或覆蓋jobQueue
        }

setTotalFrames :: JobID -> Maybe Int -> Progress -> Progress
setTotalFrames jobID totalFrames p@(Progress jobMap jobQueue) =
  let updateJobState job = job {totalFrames = totalFrames}
   in p
        { jobMap = M.adjust updateJobState jobID jobMap, -- 修該對應jobID的值
          jobQueue = jobID : filter (/= jobID) jobQueue -- 加入或覆蓋jobQueue
        }

insertJob :: JobID -> Job -> Progress -> Progress
insertJob jobID job p@(Progress jobMap _) =
  p
    { jobMap = M.insert jobID job jobMap
    }

mkJob :: String -> FilePath -> FilePath -> Job
mkJob videoName fp outputDir =
  Job
    { videoName = videoName,
      state = Waiting,
      videoDir = fp,
      outputDir = outputDir,
      totalFrames = Nothing
    }

getJob :: Progress -> JobID -> Maybe Job
getJob p jobID = M.lookup jobID (jobMap p)

defaultProgress :: Progress
defaultProgress = Progress M.empty []