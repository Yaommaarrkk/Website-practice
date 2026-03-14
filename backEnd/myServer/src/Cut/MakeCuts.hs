--啟用LambdaCase語法糖(\case)
{-# LANGUAGE LambdaCase #-}

module Cut.MakeCuts
  ( CutsFormat (..),
    CccFormat,
    getFps,
    getScale,
    get_m_filePaths,
    newDir,
    makeCuts,
    cutCutCut,
  )
where

--(執行外部程式, 取得外部程式印出的資料)

import Control.Concurrent.Async (async, wait)
import Control.Exception (SomeException, try)
import Control.Monad (forM, void)
import Control.Monad.IO.Class (liftIO)
import Control.Monad.Trans.Class (lift)
import Control.Monad.Trans.Except
import Control.Monad.Trans.Reader (runReaderT)
import qualified Cut.MakeCuts_type as MC_type
import Data.Aeson (decode)
import qualified Data.ByteString.Char8 as BC
import Data.Foldable (forM_)
import Data.List (intercalate, sortBy)
import Data.Ord (comparing)
import Data.Sequence (length)
import Data.Time (defaultTimeLocale, formatTime, getCurrentTime)
import Data.Time.Clock (getCurrentTime)
import Error as Er
import GHC.Maybe (Maybe (Just))
import General
import qualified MyLibrary.Time as MTime
import qualified Request as Rq
import System.Directory (createDirectoryIfMissing, getCurrentDirectory)
import System.Directory.Internal.Prelude (forkIO, hClose, map)
import System.Exit (ExitCode)
import System.FilePath (splitDirectories, takeBaseName, takeDirectory, takeFileName, (</>))
import System.Process (CreateProcess (..), StdStream (..), callProcess, createProcess, proc, waitForProcess)
import Text.Regex.TDFA ((=~))

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
  t =~ "^([0-9]+:)?([0-5]?[0-9]):([0-5]?[0-9](\\.[0-9]+)?)$"
    || t =~ "^[0-9]+(\\.[0-9]+)?$" -- hh:mm:ss.xxx / mm:ss.xxx
    -- ss.xxx

getOp :: CccFormat -> String
getOp (Just op_str, _) = if validTime op_str then op_str else ""
getOp (_, _) = ""

getEd :: CccFormat -> String
getEd (_, Just ed_str) = if validTime ed_str then ed_str else ""
getEd (_, _) = ""

get_m_filePaths :: Maybe Rq.Bodies -> Maybe [FilePath]
-- 理論上m_bodies(JSON格式的Body)恰有一個成員
-- 在這裡解析JSON 而不是在Request
get_m_filePaths (Just (body : _)) = (decode . BC.fromStrict) body :: Maybe [String]
get_m_filePaths _ = Nothing

newDir :: FilePath -> String -> MTime.TimeFormat -> IO FilePath -- TimeFormat = FullTimestamp | TimeOfDay | Empty
newDir path prefix suffix = do
  timestamp <- formatTime defaultTimeLocale (prefix <> show suffix) <$> getCurrentTime
  let tempDir = path </> timestamp
  createDirectoryIfMissing True tempDir
  return tempDir

makeCuts :: RequestID -> FilePath -> [FilePath] -> CutsFormat -> MyIO FilePath -- 回傳tempDir
makeCuts requestID tempDir inputs cf = do
  let longJob = do
        forM inputs $ \fp -> do
          let videoName = takeBaseName fp
          tempVideoDir <- liftIO $ newDir tempDir videoName MTime.TimeOfDay
          jobID <- newJobID -- 流水號ID++並回傳
          let newJob = MC_type.mkJob videoName fp tempVideoDir
          updateJob requestID (MC_type.insertJob jobID newJob)

          r <- runExceptT (makeCutsSingle requestID jobID cf)
          case r of
            Left err -> return [err]
            Right _ -> return []
  env <- ask
  liftIO $ forkIO $ void $ runReaderT longJob env -- 非同步執行切片 forkIO只吃IO 所以要runReaderT降級
  -- liftIO $ async (runReaderT longJob env) -- 非同步執行切片 async只吃IO 所以要runReaderT降級
  pure tempDir -- 提前回傳資料夾路徑

-- 產生切片
makeCutsSingle :: RequestID -> MC_type.JobID -> CutsFormat -> ExceptT Er.Error MyIO ()
makeCutsSingle requestID jobID cf = do
  -- 印出目前工作目錄(debug用)
  -- cwd <- liftIO getCurrentDirectory
  -- liftIO $ putStrLn ("Current working directory: " ++ cwd)
  lift $ updateJob requestID (MC_type.updateState jobID MC_type.Processing)
  m_progress <- lift $ getJob requestID

  progress <- case m_progress of
    Nothing -> throwE $ Error (ApiCut_err, "func: makeCutsSingle can't find key(requestID) in jobMap")
    Just progress -> return progress

  job <- case MC_type.getJob progress jobID of
    Nothing -> throwE $ Error (ApiCut_err, "func: makeCutsSingle can't find key(jobID) in progress")
    Just job -> return job

  let tempVideoDir = MC_type.outputDir job
      videoDir = MC_type.videoDir job

  liftIO $ createDirectoryIfMissing True tempVideoDir -- 確定暫存資料夾存在

  -- i(輸入檔案) vf(video filter: fps每秒的影格數 scale縮放大小) 最後(輸出檔案)
  let vf = "fps=" ++ show (getFps cf) ++ ",scale=" ++ show (getScale cf) ++ ":-1" -- -1保持原本比例
      args = ["-y", "-i", videoDir, "-vf", vf, tempVideoDir </> "%05d.jpg"]

  env <- lift ask
  liftIO $
    void $
      forkIO $ do
        let process =
              (proc "ffmpeg" args)
                { std_in = NoStream,
                  std_out = CreatePipe,
                  std_err = CreatePipe
                }
        -- callProcess只能同步 會控制stdout 所以用更低階的createProcess執行非同步
        (_, Just hout, Just herr, ph) <- createProcess process -- 啟動process立馬回傳
        hClose hout
        hClose herr
        void $ waitForProcess ph -- 等待真正切完
        -- case e_r of
        --   Left err -> do
        --     lift $ updateJob requestID (MC_type.updateState jobID MC_type.Error)
        --   Right _ -> do
        void $ runReaderT (updateJob requestID (MC_type.updateState jobID MC_type.Done)) env
  return ()

cutCutCut :: [FilePath] -> CccFormat -> IO (Int, [Error]) -- 回傳tempDir
cutCutCut inputs cf = do
  now <- liftIO getCurrentTime
  let timestamp = formatTime defaultTimeLocale "cutCutCut__%Y%m%d-%H%M%S" now
      tempDir = projectPath </> "temp" </> timestamp
  liftIO $ createDirectoryIfMissing True tempDir

  results <- forM inputs $ \fp -> do
    r <- runExceptT (cutCutCutSingle fp cf tempDir)
    case r of
      Left err -> return [err]
      Right _ -> return []

  let errors = concat results
  return (Prelude.length inputs - Prelude.length errors, errors)

cutCutCutSingle :: FilePath -> CccFormat -> FilePath -> ExceptT Er.Error IO ()
cutCutCutSingle input cf tempDir = do
  liftIO $ createDirectoryIfMissing True tempDir -- 確定暫存資料夾存在
  let ss = if getOp cf == "" then [] else ["-ss", getOp cf]
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
    go duplicatePart [(_, fileName)] =
      -- 池子只剩一個
      [toFileName duplicatePart fileName]
    go duplicatePart (([], a_fileName) : as) =
      -- 池子的第一個的路徑用完了
      toFileName duplicatePart a_fileName : go duplicatePart as
    go duplicatePart pool@((x : _, _) : as) =
      case getSame x pool of
        [] -> []
        [single] -> go duplicatePart [single] ++ go duplicatePart as
        chosen -> go (x : duplicatePart) chosen ++ go duplicatePart (drop (Prelude.length chosen) pool)
      where
        getSame seq ((x : xs, path) : ys)
          | x == seq = (xs, path) : getSame seq ys
          | otherwise = []
        getSame x _ = []

    toFileName [] fileName = fileName
    toFileName duplicatePart fileName =
      intercalate "_" duplicatePart ++ "__" ++ fileName