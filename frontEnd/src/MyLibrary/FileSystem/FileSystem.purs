module MyLibrary.FileSystem.FileSystem where

import Prelude
import Effect (Effect)
import Data.Array (filter, length)
import FFI.JS.FileSystem (FileInfo, readDir)

getAllDirInDir :: String -> Effect (Array String) -- 拿到資料夾內的所有資料夾
getAllDirInDir dir = do
  entries <- readDir dir -- 取得資料夾內所有檔案/資料夾
  let dirs = filter _.isDir entries -- 只留資料夾
  pure (map _.name dirs) -- 回傳檔名

getTotalFrames :: String -> Effect Int -- 拿到資料夾內檔案的數量
getTotalFrames dir = do
  entries <- readDir dir -- 取得資料夾內所有檔案/資料夾
  let files = filter (not <<< _.isDir) entries -- 只留檔案
  pure (length files) -- 回傳檔案數量

-- getTotalFrames :: String -> Effect Int
-- getTotalFrames dir = do
--   entries <- readDir dir
--   H.liftEffect $ log "entries in getTotalFrames:"
--   H.liftEffect $ logShow entries
--   let files = filter (not <<< _.isDir) entries
--   H.liftEffect $ log "files:"
--   H.liftEffect $ logShow files
--   pure (length files)