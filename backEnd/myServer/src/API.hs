module API
  ( handleURL
  ) where

import Data.List (isInfixOf)
import Data.List.Split (splitOn)
import Data.Maybe (fromMaybe, catMaybes)
import Data.Either (lefts)
import Text.Read (readMaybe)
import System.Directory (doesFileExist, listDirectory)
import System.FilePath (joinPath)
import qualified Data.Map as M
import Data.Aeson (Value, object, (.=), decode, encode)
import Data.Aeson.Key (fromString)
    
import qualified Data.ByteString as BS
import qualified Data.ByteString.Lazy.Char8 as BLC
import qualified Data.ByteString.Char8 as BC
import qualified Network.Socket as NS
import Control.Monad.Trans.Except (runExceptT)

import qualified Request as Rq
import qualified Respond as Rp
import qualified Http
import Error
import qualified Cut.MakeCuts as MC

import General

data ArgType = AT_Int | AT_String
data ArgValue = AV_Int Int | AV_String String
type ApiHandler = NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO [Error]

apiRouteTable :: [((Rq.Method, BC.ByteString), [API.ArgType], API.ApiHandler)]
apiRouteTable =
  [ --練習
    ((Rq.GET, BC.pack "echo"),  [AT_Int, AT_String], API.echo)
  , ((Rq.GET, BC.pack "os"),  [], API.handleOS)
  , ((Rq.GET, BC.pack "file"),  [], API.handleFile Http.View)
  , ((Rq.GET, BC.pack "file/view"),  [AT_String], API.handleFile Http.View)
  , ((Rq.GET, BC.pack "file/download"),  [AT_String], API.handleFile Http.Download)
  , ((Rq.POST, BC.pack "file/upload"),  [], API.handleUploadFile)
    --實際功能
  , ((Rq.POST, BC.pack "makeCuts"),  [AT_String], API.handleMakeCuts)
  ]

parseArgsDynamic :: [String] -> [ArgType] -> Either Error [ArgValue]
parseArgsDynamic inputs argTypes
    | length inputs /= length argTypes = Left $ Error (Api_funcOrArgErr, "should be " ++ (show $ length argTypes) ++" param(s)")
    | otherwise = sequence $ zipWith parseOne inputs argTypes
  where
    parseOne arg AT_Int =
      case readMaybe arg of -- readMaybe 安全的把Str轉某型別 
        Just x -> Right (AV_Int x) 
        _ -> Left $ Error (Api_funcOrArgErr, "String to Int 轉換失敗")
    parseOne arg AT_String =
      Right (AV_String arg)

handleRequestArgs :: NS.Socket -> String -> [String] -> Rq.Request -> IO [Error]
handleRequestArgs clientSocket apiRoute rawArgs (Rq.Request method _ headers m_bodies) = do
  let
    apiRoute_BC = BC.pack apiRoute
  -- 拿(GET, "echo")當key去找value([ArgType], <method>)
  case lookup (method, apiRoute_BC) (map (\(k,ts,h) -> (k, (ts, h))) apiRouteTable) of
    Nothing -> return [Error (UnexpectedError, "handleRequestArgs apiRouteTable的路由不存在")]
    Just (expectedTypes, func) -> 
      case parseArgsDynamic rawArgs expectedTypes of
        Left err -> return [err] -- 參數檢查沒通過
        Right argValues ->
          case method of
            Rq.GET -> func clientSocket argValues (headers, m_bodies) -- 直接拿路由表的method呼叫
            Rq.POST -> func clientSocket argValues (headers, m_bodies)
            _ -> return [Error (UnexpectedError,"handleRequestArgs Unknown func")]

handleURL :: NS.Socket -> Rq.Request -> IO [Error]
handleURL clientSocket request@(Rq.Request method path headers _) = 
  case method of
    Rq.GET -> 
      case path of
        -- API GET
        Rq.Path ["api"] -> return [Error (Api_funcOrArgErr, "api-get Missing function")]
        Rq.Path ("api" : "echo" : args) -> handleRequestArgs clientSocket "echo" args request
        Rq.Path ("api" : "os" : args) -> handleRequestArgs clientSocket "os" args request
        Rq.Path ("api" : "file" : "view" : args) -> handleRequestArgs clientSocket "file/view" args request
        Rq.Path ("api" : "file" : "download" : args) -> handleRequestArgs clientSocket "file/download" args request
        Rq.Path ("api" : "file" : args) -> handleRequestArgs clientSocket "file" args request
        Rq.Path ("api" : _) -> return [Error (Api_funcOrArgErr, "api-get Can't find function")]
        -- static Website
        Rq.Path [] -> handleWebsitePage clientSocket "output/Main/home.html" headers
        Rq.Path ["home"] -> handleWebsitePage clientSocket "output/Main/home.html" headers
        Rq.Path args -> handleWebsitePage clientSocket (joinPath args) headers
    Rq.POST ->
      case path of
        -- API POST
        Rq.Path ("api" : "file" : "upload" : args) -> handleRequestArgs clientSocket "file/upload" args request
        Rq.Path ("api" : "cut" : "makeCuts" : args) -> handleRequestArgs clientSocket "makeCuts" args request
        Rq.Path ("api" : _) -> return [Error (Api_funcOrArgErr, "api-post Can't find function")]
        _ -> return [Error (Api_funcOrArgErr, "handleURL POST should add \"api/\"")]
    _ -> return [Error (UnexpectedError, "handleURL Unexpected Request-Method")]

-- 以下是GET
getOS :: Rq.Headers -> Either String [Error]
getOS headers = 
  case findOS userAgentArr of
    Just os
      | os `elem` [Http.Windows, Http.MacOS, Http.Linux] -> Left "PC"
      | os `elem` [Http.IOS, Http.Android] -> Left "Mobile"
      | otherwise -> Right [Error (UnexpectedError, "getOS Unexpected OS found: " ++ show os)]
    Nothing -> Right [Error (Api_FuncExecuteErr, "api/handleOS missing userAgent-OS")]
  where
    userAgentArr = Rq.parseUserAgent $ fromMaybe "" (Rq.lookupBSrS headers (BC.pack "User-Agent"))
    findOS arr
      | any (\s -> isInfixOf "Windows" s) arr = Just Http.Windows
      | any (\s -> isInfixOf "Macintosh" s) arr = Just Http.MacOS
      | any (\s -> isInfixOf "Linux" s) arr = Just Http.Linux
      | any (\s -> isInfixOf "Android" s) arr = Just Http.Android
      | any (\s -> isInfixOf "iPhone" s) arr = Just Http.IOS
      | otherwise = Nothing

doubleChars :: Int -> String -> String
doubleChars multiple str = concatMap (\c -> take multiple (repeat c)) str -- concatMap會攤平

echo :: NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO [Error]
echo clientSocket [AV_Int multiple, AV_String message] _ = do
  _ <- Rp.respondMessage clientSocket True (doubleChars multiple message)
  return []
echo _ _ _ = do
  return [Error (UnexpectedError, "api/handleFile Pattern matching failed")]

handleOS :: NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO [Error]
handleOS clientSocket _ (headers, _) = 
  case getOS headers of
    Left os_str -> do
      let
        myVars = M.fromList [(fromString "userDevice", os_str)]
        json :: Rp.ResponseJSON Value
        json = Rp.ResponseJSON
          { Rp.success = True
          , Rp.message = "User device is " ++ os_str
          , Rp.result  = Just $ object (map (\(k,v) -> k .= v) (M.toList myVars))
          }
      Rp.respondJSON clientSocket json Http.SC200

handleFile :: Http.DispositionType -> NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO [Error]
handleFile _ clientSocket [] _ = do
  allFilesName <- listDirectory $ backEndProjectPath ++ "static/test_sendFile"
  Rp.respondMessage clientSocket True (unlines allFilesName)
handleFile dType clientSocket [AV_String fileName] _ = do
  let filePath = backEndProjectPath ++ "static/test_sendFile/" ++ fileName
  _ <- putStrLn $ "filePath:" ++ filePath
  isFileExist <- doesFileExist filePath
  _ <- putStrLn $ "doesFileExist filePath:" ++ show isFileExist
  if isFileExist then do
    Rp.buildResponseFile clientSocket filePath dType
  else do
    return [Error (ApiFile_fileNotFound, "api/handleFile can't find file\n\tmaybe try \"test_sendFile.gif\"")]
handleFile _ _ _ _ = do
    return [Error (UnexpectedError, "api/handleFile Pattern matching failed")]


-- 以下是POST
saveFile :: NS.Socket -> Rq.FormPart -> IO (Maybe Error)
saveFile _ (Rq.FormFile _ fileName content) = do
  let filePath = backEndProjectPath ++ "static/test_sendFile/" ++ fileName
  isFileExist <- doesFileExist filePath
  if isFileExist
    -- 檔名存在就不讓存檔
    then return $ Just $ Error (ApiUploadFile_fileIsAlreadyExist, "api/handleUploadFile - file is already exist")
    else BS.writeFile filePath content >> return Nothing
saveFile _ _ = return $ Just $ Error (UnexpectedError, "api/handleUploadFile - saveFile\n Pattern matching failed")

handleMakeCuts :: NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO [Error]
handleMakeCuts clientSocket [AV_String filePathAndArgs] (_, m_bodies) = do
  safePrint "\n[INFO] [filePaths]\n[From: API.handleMakeCuts]"
  safePrint $ "m_filePaths: " ++ show m_filePaths
  case m_filePaths of
    Nothing -> return [Error (ApiCut_err, "api/handleMakeCuts missing filePaths in body")]
    Just filePaths -> do
      (tempDir, errs) <- MC.makeCuts filePaths cf
      let
        myVars = M.fromList [(fromString "tempDirPath", tempDir), (fromString "error", show errs)]
        json :: Rp.ResponseJSON Value
        json = Rp.ResponseJSON
          { Rp.success = case errs of
              [] -> True
              _  -> False
          , Rp.message = "Temp dir is: " ++ tempDir
          , Rp.r_type = "APIMakeCuts"
          , Rp.result  = Just $ object (map (\(k,v) -> k .= v) (M.toList myVars))
          }
      -- safePrint "\n[INFO] [response]\n[From: API.handleMakeCuts]"
      -- safePrint $ "Response JSON: " ++ BLC.unpack (encode json)
      Rp.respondJSON clientSocket json Http.SC200

  where
    queries = case splitOn "?" filePathAndArgs of
      [] -> []
      [_] -> []
      [_, style] -> Rq.parseQuery style
    m_filePaths = case m_bodies of -- 理論上m_bodies(JSON格式的Body都)恰有一個成員
      Just bodies ->
        case bodies of
          (b:_) -> (decode . BC.fromStrict) b :: Maybe [String] -- 在這裡解析JSON 而不是在Request
          _ -> Nothing
      Nothing -> Nothing
    cf = MC.CutsFormat (Rq.lookupInt queries "fps") (Rq.lookupInt queries "scale")
handleMakeCuts _ _ _ = do
  return [Error (UnexpectedError, "api/handleMakeCuts Pattern matching failed")]

handleUploadFile :: NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO [Error]
handleUploadFile clientSocket _ (headers, m_body) = do
  results <- mapM (saveFile clientSocket) onlyFiles  -- IO [Maybe Error]
  case catMaybes results of -- 把Nothing篩掉
      [] -> Rp.respondMessage clientSocket True "upload file success"
      err -> return err
  where
    -- parseMultiBody :: Request -> [FormPart]
    formParts = Rq.parseMultiBody headers m_body
    -- 篩掉 不是FormFile 和 沒有fileName
    onlyFiles = [ f | f@(Rq.FormFile fileName _ _) <- formParts
                , not $ null fileName ]

-- 以下是靜態網頁
-- handleWebsiteRoutes :: NS.Socket -> Path -> Rq.Headers -> IO [Error]
-- handleWebsiteRoutes clientSocket (Path ["home"]) headers = respondMessage clientSocket True 
--   (BC.pack $ unlines
--     [ "This is home"
--     , "API:"
--     , "\techo/message(string)"
--     , "\tos"
--     , "\tfile"
--     , "\tfile/view||download/filePath(string)"
--     ])
-- handleWebsiteRoutes clientSocket (Path path) headers = return [Error (Website_websiteNotFound, "website not found\n\tCan't find this page")]
handleWebsitePage :: NS.Socket -> FilePath -> Rq.Headers -> IO [Error]
handleWebsitePage clientSocket filePath headers = do
  let finalFilePath = frontEndProjectPath ++ filePath
  case getOS headers of
    Left "PC" -> Rp.buildResponseFile clientSocket finalFilePath Http.View
    Left "Mobile" -> return [Error (UnexpectedError, "handleWebsitePage This website not supported on mobile phones")]
    Right err -> return err
    _ -> return [Error (UnexpectedError, "handleWebsitePage Pattern matching failed")]