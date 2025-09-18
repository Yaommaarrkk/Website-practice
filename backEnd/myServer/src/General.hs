module General
  ( backEndProjectPath
  , frontEndProjectPath
  , printLock
  , safePrint
  ) where

import Control.Concurrent.MVar
import System.IO.Unsafe (unsafePerformIO)

backEndProjectPath :: [Char]
backEndProjectPath = "D:/coding/encoding/httpServer/fileUpload_2/backEnd/myServer/"
frontEndProjectPath :: [Char]
frontEndProjectPath = "D:/coding/encoding/httpServer/fileUpload_2/frontEnd/"

{-# NOINLINE printLock #-}
printLock :: MVar ()
printLock = unsafePerformIO (newMVar ())

-- 安全列印 debug用 避免多線程造成行內文字交錯
safePrint :: String -> IO ()
safePrint msg = withMVar printLock $ \_ -> putStrLn msg
