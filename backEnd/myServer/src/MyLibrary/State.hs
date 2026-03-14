module MyLibrary.State
  ( MyEnv(..)
  , newEnv
  , MyIO
  , RequestID(..)
  , JobMap(..)
  , Progress(..)
  , insertJob
  , deleteJob
  , updateJob
  , ask
  , getJob
  , getJobMap
  , newJobID
  ) where

import qualified Network.Socket as NS
import qualified Data.Map as M

import Data.Time
import Data.Time.Format

import Control.Monad.Reader (ReaderT(..))
import Control.Concurrent.STM (TVar)
import Control.Concurrent.STM.TVar (modifyTVar', newTVarIO, readTVarIO, readTVar)
import Control.Monad.STM (atomically)
import Control.Monad.IO.Class (liftIO)

import qualified Cut.MakeCuts_type as MC_type
import qualified MyLibrary.Time as MTime

data MyEnv = MyEnv
  { jobTVar :: TVar JobMap
  , serverSocket :: NS.Socket
  , jobCounter :: TVar Int
  }

type MyIO = ReaderT MyEnv IO
-- ReaderT r m a
-- r 是 MyEnv
-- m 是 IO

newEnv :: NS.Socket -> IO MyEnv
newEnv serverSocket = do
  jobTVar <- newTVarIO M.empty
  jobCounter <- newTVarIO 0
  return MyEnv
    { jobTVar = jobTVar
    , serverSocket = serverSocket
    , jobCounter = jobCounter
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
  liftIO $ atomically $
    modifyTVar' (jobTVar env) $
      M.adjust f requestID

getJob :: RequestID -> MyIO (Maybe Progress)
getJob requestID = 
  M.lookup requestID <$> getJobMap

getJobMap :: MyIO (M.Map RequestID Progress)
getJobMap = do
  env <- ask
  liftIO $ readTVarIO (jobTVar env) -- = atomically readTVar

newJobID :: MyIO Int
newJobID = do
  env <- ask
  liftIO $ atomically $ do
    modifyTVar' (jobCounter env) (+1)
    readTVar (jobCounter env) -- 因modifyTVar'固定回傳 ()