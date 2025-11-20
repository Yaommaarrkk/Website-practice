module General
  ( backEndProjectPath
  , frontEndProjectPath
  , projectPath
  , printLock
  , safePrint
  ) where

import Control.Concurrent.MVar
import System.IO.Unsafe (unsafePerformIO)

backEndProjectPath :: [Char]
backEndProjectPath = "D:/coding/encoding/httpServer/multipleCutVideo/backEnd/myServer/"
frontEndProjectPath :: [Char]
frontEndProjectPath = "D:/coding/encoding/httpServer/multipleCutVideo/frontEnd/"
projectPath :: [Char]
projectPath = "D:/coding/encoding/httpServer/multipleCutVideo/"

{-# NOINLINE printLock #-}
printLock :: MVar ()
printLock = unsafePerformIO (newMVar ())

-- 安全列印 debug用 避免多線程造成行內文字交錯
safePrint :: String -> IO ()
safePrint msg = withMVar printLock $ \_ -> putStrLn msg
