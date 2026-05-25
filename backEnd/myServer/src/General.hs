module General
  ( module MyLibrary.Environment,
    backEndProjectPath,
    frontEndProjectPath,
    projectPath,
    printLock,
    safePrint,
    safePrintIO,
    setThreadAffinity,
    getLogger,
    withLogger,
    Logger,
  )
where

import Control.Concurrent
import Control.Concurrent.MVar
import Control.Concurrent.STM (TQueue, writeTQueue)
import Control.Applicative ((<|>))
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Reader (asks)
import Control.Monad.STM (atomically)
import Data.Bits (shiftL)
import qualified Data.Map as M
import Foreign
import Foreign.C.Types
import Foreign.C.Types (CULong)
import MyLibrary.Environment
import qualified Network.Socket as NS
import System.Directory (getCurrentDirectory)
import System.Environment (lookupEnv)
import System.FilePath (addTrailingPathSeparator, normalise, (</>))
import System.IO
import System.IO.Unsafe (unsafePerformIO)
import System.Win32.Types (DWORD, HANDLE)

backEndProjectPath :: [Char]
backEndProjectPath =
  envPathOr "MCV_BACKEND_PATH" (projectPath </> "backEnd" </> "myServer")
{-# NOINLINE backEndProjectPath #-}

frontEndProjectPath :: [Char]
frontEndProjectPath =
  envPathOr "MCV_FRONTEND_PATH" (projectPath </> "frontEnd")
{-# NOINLINE frontEndProjectPath #-}

projectPath :: [Char]
projectPath =
  unsafePerformIO $ do
    mProjectPath <- lookupEnv "MCV_PROJECT_PATH"
    mProjectRoot <- lookupEnv "MCV_PROJECT_ROOT"
    cwd <- getCurrentDirectory
    return $ normalizeDir $ case mProjectPath <|> mProjectRoot of
      Just path -> path
      Nothing -> cwd
{-# NOINLINE projectPath #-}

envPathOr :: String -> FilePath -> FilePath
envPathOr key fallback =
  unsafePerformIO $ do
    mPath <- lookupEnv key
    return $ normalizeDir $ maybe fallback id mPath

normalizeDir :: FilePath -> FilePath
normalizeDir = addTrailingPathSeparator . normalise

{-# NOINLINE printLock #-}
printLock :: MVar ()
printLock = unsafePerformIO (newMVar ())

type Logger = String -> IO ()

getLogger :: MyIO Logger
getLogger = do
  q <- asks logQueue
  return (safePrintIO q)

withLogger :: (Logger -> IO a) -> MyIO a
withLogger action = do
  logger <- getLogger
  liftIO $ action logger

-- 安全列印 debug用 避免多線程造成行內文字交錯
safePrint :: String -> MyIO ()
safePrint msg = do
  logger <- getLogger
  liftIO $ logger msg

safePrintIO :: TQueue String -> Logger
safePrintIO queue msg =
  atomically $ writeTQueue queue msg

foreign import ccall "windows.h SetThreadAffinityMask"
  c_SetThreadAffinityMask :: HANDLE -> DWORD -> IO DWORD

setThreadAffinity :: HANDLE -> Int -> IO ()
setThreadAffinity handle cpuIndex = do
  let one :: Word32
      one = 1
      mask :: DWORD
      mask = one `shiftL` cpuIndex -- 已經是 DWORD / Word32
  _ <- c_SetThreadAffinityMask handle mask
  return ()
