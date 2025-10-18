--啟用LambdaCase語法糖(\case)
{-# LANGUAGE LambdaCase #-}

module Cut.MakeCuts
  ( CutsFormat(..),
    getFps,
    getScale,
    makeCuts
  ) where

import Control.Exception (SomeException, try)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Trans.Except
import System.Process (callProcess) --(執行外部程式, 取得外部程式印出的資料)
import System.Directory (createDirectoryIfMissing)

import Error as Er

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

makeCuts :: FilePath -> CutsFormat -> ExceptT Er.Error IO () --參數(輸入檔名, 輸出檔名, 去頭秒數, 去尾秒數) Word為正整數
makeCuts input cf = do
  let tempDir = "temp"
  liftIO $ createDirectoryIfMissing True tempDir -- 確定暫存資料夾存在

  -- i(輸入檔案) vf(video filter: fps每秒的影格數 scale縮放大小) 最後(輸出檔案)
  let 
    vf = "fps=" ++ show (getFps cf) ++ ",scale=" ++ show (getScale cf) ++ ":-1" -- -1保持原本比例
    args = ["-i", input, "-vf", vf, tempDir ++ "/%05d.jpg"]
  

  liftIO (try (callProcess "ffmpeg" args)) >>= \case
    Left err -> throwE $ Error (ApiCut_err, "error: ffmpeg 切片失敗\nnerrorMessage: " ++ show (err :: SomeException))
    Right _ -> return ()


