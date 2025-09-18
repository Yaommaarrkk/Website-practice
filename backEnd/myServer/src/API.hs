module API
  ( handleURL
  ) where

import Data.List (isInfixOf)
import Data.Maybe (fromMaybe, catMaybes)
import Text.Read (readMaybe)
import System.Directory (doesFileExist, listDirectory)
import System.FilePath (joinPath)
    
import qualified Data.ByteString as BS
import qualified Data.ByteString.Char8 as BC
import qualified Network.Socket as NS

import qualified Request as Rq
import qualified Respond as Rp
import qualified Http
import Error as Er

import General
returnErr = return . Just

data ArgType = AT_Int | AT_String
data ArgValue = AV_Int Int | AV_String String
type ApiHandler = NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO (Maybe Error)

apiRouteTable :: [((Rq.Method, BC.ByteString), [API.ArgType], API.ApiHandler)]
apiRouteTable =
  [ ((Rq.GET, BC.pack "echo"),  [AT_Int, AT_String], API.echo)
  , ((Rq.GET, BC.pack "os"),  [], API.handleOS)
  , ((Rq.GET, BC.pack "file"),  [], API.handleFile Http.View)
  , ((Rq.GET, BC.pack "file/view"),  [AT_String], API.handleFile Http.View)
  , ((Rq.GET, BC.pack "file/download"),  [AT_String], API.handleFile Http.Download)
  , ((Rq.POST, BC.pack "file/upload"),  [], API.handleUploadFile)
  ]

parseArgsDynamic :: [String] -> [ArgType] -> Either Error [ArgValue]
parseArgsDynamic inputs argTypes
    | length inputs /= length argTypes = Left defaultError { errCode = Api_funcOrArgErr, errMsg = "should be " ++ (show $ length argTypes) ++" param(s)"}
    | otherwise = sequence $ zipWith parseOne inputs argTypes
  where
    parseOne arg AT_Int =
      case readMaybe arg of
        Just x -> Right (AV_Int x) 
        _ -> Left defaultError { errCode = Api_funcOrArgErr, errMsg = "String to Int 轉換失敗"} -- readMaybe 安全的把Str轉某型別
    parseOne arg AT_String =
      Right (AV_String arg)

handleRequestArgs :: NS.Socket -> String -> [String] -> Rq.Request -> IO (Maybe Error)
handleRequestArgs clientSocket apiRoute rawArgs (Rq.Request method _ headers m_bodies) = do
  let
    apiRoute_BC = BC.pack apiRoute
  -- 拿(GET, "echo")當key去找value([ArgType], <method>)
  case lookup (method, apiRoute_BC) (map (\(k,ts,h) -> (k, (ts, h))) apiRouteTable) of
    Nothing -> returnErr defaultError { errCode = UnexpectedError, errMsg = "handleRequestArgs apiRouteTable的路由不存在" }
    Just (expectedTypes, func) -> 
      case parseArgsDynamic rawArgs expectedTypes of
        Left err -> returnErr err -- 參數檢查沒通過
        Right argValues ->
          case method of
            Rq.GET -> func clientSocket argValues (headers, Nothing) -- 直接拿路由表的method呼叫
            Rq.POST -> func clientSocket argValues (headers, m_bodies)
            _ -> returnErr defaultError { errCode = UnexpectedError, errMsg = "handleRequestArgs Unknown func"}

handleURL :: NS.Socket -> Rq.Request -> IO (Maybe Error)
handleURL clientSocket request@(Rq.Request method path headers _) = 
  case method of
    Rq.GET -> 
      case path of
        -- API GET
        Rq.Path ["api"] -> returnErr defaultError { errCode = Api_funcOrArgErr, errMsg = "api-get Missing function"}
        Rq.Path ("api" : "echo" : args) -> handleRequestArgs clientSocket "echo" args request
        Rq.Path ("api" : "os" : args) -> handleRequestArgs clientSocket "os" args request
        Rq.Path ("api" : "file" : "view" : args) -> handleRequestArgs clientSocket "file/view" args request
        Rq.Path ("api" : "file" : "download" : args) -> handleRequestArgs clientSocket "file/download" args request
        Rq.Path ("api" : "file" : args) -> handleRequestArgs clientSocket "file" args request
        Rq.Path ("api" : _) -> returnErr defaultError { errCode = Api_funcOrArgErr, errMsg = "api-get Can't find function"}
        -- static Website
        Rq.Path [] -> handleWebsitePage clientSocket "output/Main/home.html" headers
        Rq.Path ["home"] -> handleWebsitePage clientSocket "output/Main/home.html" headers
        Rq.Path args -> handleWebsitePage clientSocket (joinPath args) headers
    Rq.POST ->
      case path of
        -- API POST
        Rq.Path ("api" : "file" : "upload" : args) -> handleRequestArgs clientSocket "file/upload" args request
        Rq.Path ("api" : _) -> returnErr defaultError { errCode = Api_funcOrArgErr, errMsg = "api-post Can't find function"}
        _ -> returnErr defaultError { errCode = Api_funcOrArgErr, errMsg = "handleURL POST should add \"api/\""}
    _ -> returnErr defaultError { errCode = UnexpectedError, errMsg = "handleURL Unexpected Request-Method"}

-- 以下是GET
getOS :: Rq.Headers -> Either String Error
getOS headers = 
  case findOS userAgentArr of
    Just os
      | os `elem` [Http.Windows, Http.MacOS, Http.Linux] -> Left "PC"
      | os `elem` [Http.IOS, Http.Android] -> Left "Mobile"
      | otherwise -> Right $ defaultError { errCode = UnexpectedError, errMsg = "getOS Unexpected OS found: " ++ show os}
    Nothing -> Right $ defaultError { errCode = Api_FuncExecuteErr, errMsg = "api/handleOS missing userAgent-OS"}
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

echo :: NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO (Maybe Error)
echo clientSocket [AV_Int multiple, AV_String message] _ = do
  _ <- Rp.respondMessage clientSocket Http.SC200 (BC.pack $ doubleChars multiple message)
  return Nothing
echo _ _ _ = do
  returnErr defaultError { errCode = UnexpectedError, errMsg = "api/handleFile Pattern matching failed"}

handleOS :: NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO (Maybe Error)
handleOS clientSocket _ (headers, _) = 
  case getOS headers of
    Left os_str -> do
      Rp.respondMessage clientSocket Http.SC200 (BC.pack $ "User device is " ++ os_str)
    Right err -> returnErr err

handleFile :: Http.DispositionType -> NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO (Maybe Error)
handleFile _ clientSocket [] _ = do
  allFilesName <- listDirectory $ backEndProjectPath ++ "static/test_sendFile"
  Rp.respondMessage clientSocket Http.SC200 (BC.pack $ unlines allFilesName)
handleFile conDis clientSocket [AV_String fileName] _ = do
  let filePath = backEndProjectPath ++ "static/test_sendFile/" ++ fileName
  _ <- putStrLn $ "filePath:" ++ filePath
  isFileExist <- doesFileExist filePath
  _ <- putStrLn $ "doesFileExist filePath:" ++ show isFileExist
  if isFileExist then do
    Rp.respondFile clientSocket filePath conDis
  else do
    returnErr defaultError { errCode = ApiFile_fileNotFound, errMsg = "api/handleFile can't find file\n\tmaybe try \"test_sendFile.gif\""}
handleFile _ _ _ _ = do
    returnErr defaultError { errCode = UnexpectedError, errMsg = "api/handleFile Pattern matching failed"}

saveFile :: NS.Socket -> Rq.FormPart -> IO (Maybe Error)
saveFile _ (Rq.FormFile _ fileName content) = do
  let filePath = backEndProjectPath ++ "static/test_sendFile/" ++ fileName
  isFileExist <- doesFileExist filePath
  if isFileExist
    -- 檔名存在就不讓存檔
    then returnErr defaultError { errCode = ApiUploadFile_fileIsAlreadyExist, errMsg = "api/handleUploadFile - file is already exist"}
    else BS.writeFile filePath content >> return Nothing
saveFile _ _ = returnErr defaultError { errCode = UnexpectedError, errMsg = "api/handleUploadFile - saveFile\n Pattern matching failed"}

-- 以下是POST
handleUploadFile :: NS.Socket -> [ArgValue] -> (Rq.Headers, Maybe Rq.Bodies) -> IO (Maybe Error)
handleUploadFile clientSocket _ (headers, m_bodies) = do
  results <- mapM (saveFile clientSocket) onlyFiles  -- IO [Maybe Error]
  case catMaybes results of
      []    -> Rp.respondMessage clientSocket Http.SC200 BC.empty
      (e:_) -> return $ Just e -- 回傳第一個錯誤
  where
    -- parseMultiBody :: Request -> [FormPart]
    formParts = Rq.parseMultiBody headers m_bodies
    -- 篩掉 不是FormFile 和 沒有fileName
    onlyFiles = [ f | f@(Rq.FormFile fileName _ _) <- formParts
                , not $ null fileName ]

-- 以下是靜態網頁
-- handleWebsiteRoutes :: NS.Socket -> Path -> Rq.Headers -> IO (Maybe Error)
-- handleWebsiteRoutes clientSocket (Path ["home"]) headers = respondMessage clientSocket SC200 
--   (BC.pack $ unlines
--     [ "This is home"
--     , "API:"
--     , "\techo/message(string)"
--     , "\tos"
--     , "\tfile"
--     , "\tfile/view||download/filePath(string)"
--     ])
-- handleWebsiteRoutes clientSocket (Path path) headers = returnErr defaultError { errCode = Website_websiteNotFound, errMsg = "website not found\n\tCan't find this page"}
handleWebsitePage :: NS.Socket -> FilePath -> Rq.Headers -> IO (Maybe Error)
handleWebsitePage clientSocket filePath headers = do
  let finalFilePath = frontEndProjectPath ++ filePath
  case getOS headers of
    Left "PC" -> Rp.respondFile clientSocket finalFilePath Http.View
    Left "Mobile" -> returnErr defaultError { errCode = UnexpectedError, errMsg = "handleWebsitePage This website not supported on mobile phones"}
    Right err -> returnErr err
    _ -> returnErr defaultError { errCode = UnexpectedError, errMsg = "handleWebsitePage Pattern matching failed"}