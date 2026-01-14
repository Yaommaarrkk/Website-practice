--啟用LambdaCase語法糖(\case)
{-# LANGUAGE LambdaCase #-}

module Cut.MakeCuts
  ( CutsFormat(..),
    CccFormat,
    getFps,
    getScale,
    get_m_filePaths,
    makeCuts,
    cutCutCut,
  ) where

import Control.Monad (forM)

import Data.List (intercalate, sortBy)
import Data.Ord (comparing)
import Data.Time (getCurrentTime, formatTime, defaultTimeLocale)
import Control.Exception (SomeException, try)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Trans.Except
import System.Process (callProcess) --(執行外部程式, 取得外部程式印出的資料)
import System.Directory (createDirectoryIfMissing, getCurrentDirectory)
import System.FilePath (takeBaseName, takeFileName, takeDirectory, splitDirectories, (</>))
import Data.Aeson (decode)
import Text.Regex.TDFA ((=~))

import qualified Data.ByteString.Char8 as BC
import Error as Er
import General
import qualified Request as Rq
import System.Directory.Internal.Prelude (map)

data CutsFormat = CutsFormat
  { _fps :: Maybe Int,
    _scale :: Maybe Int
  } 

type CccFormat = (Maybe String, Maybe String) -- (op, ed)

getFps :: CutsFormat -> Int
getFps (CutsFormat (Just fps) _) = if fps > 0 then fps else 10
getFps (CutsFormat Nothing _) = 10

getScale :: CutsFormat -> Int
getScale (CutsFormat _ (Just scale)) = if scale > 0 then scale else 160
getScale (CutsFormat _ Nothing) = 160

validTime :: String -> Bool -- 時間格式檢查 為了給ffmpeg對的參數
validTime t =
  t =~ "^([0-9]+:)?([0-5]?[0-9]):([0-5]?[0-9](\\.[0-9]+)?)$" ||  -- hh:mm:ss.xxx / mm:ss.xxx
  t =~ "^[0-9]+(\\.[0-9]+)?$"                                      -- ss.xxx

getOp :: CccFormat -> String
getOp (Just op_str, _) = if validTime op_str then op_str else ""
getOp (_, _) = ""

getEd :: CccFormat -> String
getEd (_, Just ed_str) = if validTime ed_str then ed_str else ""
getEd (_, _) = ""

get_m_filePaths :: Maybe Rq.Bodies -> Maybe [FilePath]
-- 理論上m_bodies(JSON格式的Body)恰有一個成員
-- 在這裡解析JSON 而不是在Request
get_m_filePaths (Just (body:_)) = (decode . BC.fromStrict) body :: Maybe [String]
get_m_filePaths _ = Nothing

makeCuts :: [FilePath] -> CutsFormat -> IO (FilePath, [Error]) -- 回傳tempDir
makeCuts inputs cf = do
  now <- liftIO getCurrentTime
  let timestamp = formatTime defaultTimeLocale "makeCuts_%Y%m%d-%H%M%S" now
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
    Left err -> throwE $ Error (ApiCut_err, "error: ffmpeg 切片失敗\nerrorMessage: " ++ show (err :: SomeException))
    Right _ -> return ()


cutCutCut :: [FilePath] -> CccFormat -> IO (Int, [Error]) -- 回傳tempDir
cutCutCut inputs cf = do
  now <- liftIO getCurrentTime
  let timestamp = formatTime defaultTimeLocale "cutCutCut__%Y%m%d-%H%M%S" now
      tempDir   = projectPath </> "temp" </> timestamp
  liftIO $ createDirectoryIfMissing True tempDir

  results <- forM inputs $ \fp -> do
    r <- runExceptT (cutCutCutSingle fp cf tempDir)
    case r of
      Left err -> return [err]
      Right _  -> return []

  let errors = concat results
  return (length inputs - length errors, errors)

cutCutCutSingle :: FilePath -> CccFormat -> FilePath -> ExceptT Er.Error IO ()
cutCutCutSingle input cf tempDir = do

  liftIO $ createDirectoryIfMissing True tempDir -- 確定暫存資料夾存在

  let 
    ss = if getOp cf == "" then [] else ["-ss", getOp cf]
    to = if getEd cf == "" then [] else ["-to", getEd cf]
    --參數(輸入檔名, 去頭秒數, 去尾秒數, 輸出檔名)
    args = ["-n"] ++ ss ++ to ++ ["-i", input, "-c", "copy", tempDir ++ "/" ++ takeFileName input]
  
  liftIO (try (callProcess "ffmpeg" args)) >>= \case
    Left err -> throwE $ Error (ApiCut_err, "error: ffmpeg 剪切失敗\nerrorMessage: " ++ show (err :: SomeException))
    Right _ -> return ()

segments :: FilePath -> [String] -- 從影片回推資料夾 用於處理影片名重複時
segments = reverse . splitDirectories . takeDirectory -- (反轉 . 切成資料夾們 . 取目錄名)

uniqueSuffixes :: [FilePath] -> [String]
uniqueSuffixes filePaths = go [] sortedPaths
  where
    cutPaths :: [([String], String)] -- [([資料夾們], 檔名)]
    cutPaths = map (\x -> (segments x, takeFileName x)) filePaths
    -- compare產生[EQ/LT/GT]
    -- mconcat把可以加在一起的東西合併成一個 這邊的效果是取第一個不相等的
    cmp :: ([String], String) -> ([String], String) -> Ordering
    cmp (a, _) (b, _) = mconcat (zipWith compare a b)
    sortedPaths = sortBy cmp cutPaths

    go :: [String] -> [([String], String)] -> [String]
    go duplicatePart [(_, fileName)] = -- 池子只剩一個
      [toFileName duplicatePart fileName]
    go duplicatePart (([], a_fileName):as) = -- 池子的第一個的路徑用完了
      toFileName duplicatePart a_fileName : go duplicatePart as
    go duplicatePart pool@((x:_, _):as) = 
      case getSame x pool of
        [] -> []
        [single] -> go duplicatePart [single] ++ go duplicatePart as
        chosen -> go (x:duplicatePart) chosen ++ go duplicatePart (drop (length chosen) pool)
      where
        getSame seq ((x:xs, path):ys) 
          | x == seq = (xs, path) : getSame seq ys
          | otherwise = []
        getSame x _ = []

    toFileName [] fileName = fileName
    toFileName duplicatePart fileName =
      intercalate "_" duplicatePart ++ "__" ++ fileName