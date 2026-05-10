module MyLibrary.Environment
  ( MyEnv (..),
    newEnv,
    MyIO,
    RequestID (..),
    JobMap (..),
    Progress (..),
    insertJob,
    deleteJob,
    updateJob,
    ask,
    getJob,
    getJobMap,
    newJobID,
  )
where

import Control.Concurrent (QSem)
import Control.Concurrent.STM (TQueue, TVar)
import Control.Concurrent.STM.TQueue (writeTQueue)
import Control.Concurrent.STM.TVar (modifyTVar', newTVarIO, readTVar, readTVarIO)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Reader (ReaderT (..))
import Control.Monad.STM (atomically)
import qualified Cut.MakeCuts_type as MC_type
import qualified Data.Map as M
import Data.Time
import Data.Time.Format
import qualified MyLibrary.Threads as MThreads
import qualified MyLibrary.Time as MTime
import qualified Network.Socket as NS

data MyEnv = MyEnv
  { jobTVar :: TVar JobMap,
    serverSocket :: NS.Socket,
    jobCounter :: TVar Int,
    logQueue :: TQueue String,
    globalSem :: QSem
  }

type MyIO = ReaderT MyEnv IO

-- ReaderT r m a
-- r 是 MyEnv
-- m 是 IO

newEnv :: NS.Socket -> Int -> TQueue String -> IO MyEnv
newEnv serverSocket maxSemaphore logQueue = do
  jobTVar <- newTVarIO M.empty
  jobCounter <- newTVarIO 0
  globalSem <- MThreads.createGlobalSem maxSemaphore -- 設定全專案最大可同時跑的線程數
  return
    MyEnv
      { jobTVar = jobTVar,
        serverSocket = serverSocket,
        jobCounter = jobCounter,
        logQueue = logQueue,
        globalSem = globalSem
      }

ask :: MyIO MyEnv -- 拿環境
ask = ReaderT $ \r -> pure r

type RequestID = String

newRequestID :: IO RequestID
newRequestID = formatTime defaultTimeLocale "%Y%m%d-%H%M%S" <$> getCurrentTime

type Progress = MC_type.Progress

type JobMap = M.Map RequestID Progress

insertJob :: Progress -> MyIO RequestID
insertJob progress = do
  env <- ask
  requestID <- liftIO newRequestID
  liftIO $ atomically $ modifyTVar' (jobTVar env) (M.insert requestID progress)
  pure requestID

deleteJob :: RequestID -> MyIO ()
deleteJob requestID = do
  env <- ask
  liftIO $ atomically $ modifyTVar' (jobTVar env) (M.delete requestID)

updateJob :: RequestID -> (Progress -> Progress) -> MyIO ()
updateJob requestID f = do
  env <- ask
  liftIO $
    atomically $
      modifyTVar' (jobTVar env) $
        M.adjust f requestID

getJob :: RequestID -> MyIO (Maybe Progress)
getJob requestID =
  M.lookup requestID <$> getJobMap

getJobMap :: MyIO JobMap
getJobMap = do
  env <- ask
  liftIO $ readTVarIO (jobTVar env) -- = atomically readTVar

newJobID :: MyIO Int
newJobID = do
  env <- ask
  liftIO $
    atomically $ do
      modifyTVar' (jobCounter env) (+ 1)
      readTVar (jobCounter env) -- 因modifyTVar'固定回傳 ()