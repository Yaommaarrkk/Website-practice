--啟用LambdaCase語法糖(\case)
{-# LANGUAGE LambdaCase #-}

module Cut.Cut
  ( cutVideo
  ) where

import Control.Exception (SomeException, try)
import Control.Monad (when)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Trans.Except
import System.Directory (doesFileExist)
import System.Process (callProcess, readProcess) --(執行外部程式, 取得外部程式印出的資料)
import Text.Printf (printf) --小數->字串
import Text.Read (readMaybe)

import Cut.CheckVideo as CK
import Error as Er

cutVideo :: FilePath -> FilePath -> Maybe Word -> Maybe Word -> ExceptT Er.Error IO () --參數(輸入檔名, 輸出檔名, 去頭秒數, 去尾秒數) Word為正整數
cutVideo input output cutStart cutEnd = do
  duration <- CK.tryGetDuration input -- 呼叫tryGetDuration取得影片長度 若得到錯誤則中斷成是直接回傳
  let start = maybe 0 fromIntegral cutStart
      end = maybe 0 fromIntegral cutEnd
      newDuration = duration - start - end
  when (newDuration <= 0) $
    throwE $ Error (ApiCut_err, "error: 減掉秒數大於影片長度秒數")

  -- ss(開頭時間) i(輸入檔案) t(輸出長度) c(編碼方式) 最後(輸出檔案)
  let args = ["-ss", show start, "-i", input, "-t", printf "%.2f" newDuration, "-c", "copy", output]

  liftIO (try (callProcess "ffmpeg" args)) >>= \case
    Left err -> throwE $ Error (ApiCut_err, "error: ffmpeg 剪輯失敗\nnerrorMessage: " ++ show (err :: SomeException))
    Right _ -> return ()

tryGetDuration :: FilePath -> ExceptT Er.Error IO Double -- ExceptT 錯誤回傳值 monad類型 普通回傳值
tryGetDuration input = do
  -- 檢查檔案是否存在
  exists <- liftIO $ doesFileExist input
  when (not exists) $
    throwE $ Error (ApiCut_err, "error: 以下檔案不存在\n" ++ "\t" ++ input)
    

  -- ffmpeg指令 呼叫ffprobe函式 取得影片長度
  -- 就如平時在cmd執行ffprobe指令 終端機印出的文字 會通過readProcess回傳並存進durationStr
  result <- liftIO $ try $ readProcess "ffprobe" ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", input] ""
  case result of
    Left err -> throwE $ throwE $ Error (ApiCut_err, "error: 讀取影片長度失敗(ffprobe)\nerrorMessage: " ++ show (err :: SomeException))
    Right str -> case readMaybe str of --嘗試轉換影片長度
      Nothing -> throwE $ throwE $ Error (ApiCut_err, "error: 影片長度轉換失敗")
      Just d -> return d

