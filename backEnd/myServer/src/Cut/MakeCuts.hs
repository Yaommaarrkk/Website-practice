--啟用LambdaCase語法糖(\case)
{-# LANGUAGE LambdaCase #-}

module Cut.MakeCuts
  ( CutsFormat(..),
    getFps,
    getScale,
    makeCuts
  ) where

import Control.Monad (forM)

import Data.Time (getCurrentTime, formatTime, defaultTimeLocale)
import Control.Exception (SomeException, try)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Trans.Except
import System.Process (callProcess) --(執行外部程式, 取得外部程式印出的資料)
import System.Directory (createDirectoryIfMissing, getCurrentDirectory)
import System.FilePath (takeBaseName, (</>))

import Error as Er
import General

data CutsFormat = CutsFormat
  { _fps :: Maybe Int,
    _scale :: Maybe Int
  } 


getFps :: CutsFormat -> Int
getFps (CutsFormat (Just fps) _) = if fps > 0 then fps else 10
getFps (CutsFormat Nothing _) = 10

getScale :: CutsFormat -> Int
getScale (CutsFormat _ (Just scale)) = if scale > 0 then scale else 160
getScale (CutsFormat _ Nothing) = 160

--參數(輸入檔名, 輸出檔名, 去頭秒數, 去尾秒數) Word為正整數

makeCuts :: [FilePath] -> CutsFormat -> IO (FilePath, [Error]) -- 回傳tempDir
makeCuts inputs cf = do
  now <- liftIO getCurrentTime
  let timestamp = formatTime defaultTimeLocale "%Y%m%d-%H%M%S" now
      tempDir   = projectPath </> "temp" </> timestamp
  liftIO $ createDirectoryIfMissing True tempDir

  results <- forM inputs $ \fp -> do
    r <- runExceptT (makeCutsSingle fp cf tempDir)
    case r of
      Left err -> return [err]
      Right _  -> return []

  return (tempDir, concat results)

-- 產生切片
makeCutsSingle :: FilePath -> CutsFormat -> FilePath -> ExceptT Er.Error IO ()
makeCutsSingle input cf tempDir = do
  -- 印出目前工作目錄(debug用)
  -- cwd <- liftIO getCurrentDirectory
  -- liftIO $ putStrLn ("Current working directory: " ++ cwd)

  timeStr <- liftIO $ formatTime defaultTimeLocale "%H%M%S" <$> getCurrentTime
  -- 資料夾名稱：<檔名>_<時間>
  let tempVideoDir = tempDir </> takeBaseName input ++ "_" ++ timeStr

  liftIO $ createDirectoryIfMissing True tempVideoDir -- 確定暫存資料夾存在

  -- i(輸入檔案) vf(video filter: fps每秒的影格數 scale縮放大小) 最後(輸出檔案)
  let 
    vf = "fps=" ++ show (getFps cf) ++ ",scale=" ++ show (getScale cf) ++ ":-1" -- -1保持原本比例
    args = ["-y", "-i", input, "-vf", vf, tempVideoDir </> "%05d.jpg", "-loglevel", "quiet"]
  

  liftIO (try (callProcess "ffmpeg" args)) >>= \case
    Left err -> throwE $ Error (ApiCut_err, "error: ffmpeg 切片失敗\nnerrorMessage: " ++ show (err :: SomeException))
    Right _ -> return ()


