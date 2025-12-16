{-# LANGUAGE BlockArguments #-}
module Request
  ( Request(..)
  , Method(..)
  , Path(..)
  , Headers(..)
  , Header(..)
  , Bodies(..)
  , Body(..)
  , FormPart(..)
  , ContentDispositions(..)
  , ContentDisposition(..)
  , lookupBS
  , lookupBSrS
  , lookupInt
  , parseHeaders
  , parseMultiBody
  , splitRequest
  , parseUserAgent
  , parseQuery
  , getQueryString
  ) where

import Data.Maybe (catMaybes, mapMaybe)
import Data.List.Split (splitOn)
import Text.Read (readMaybe)
import Data.Aeson (decode)

import qualified Data.ByteString.Char8 as BC
import Error as Er

data Request = Request 
  { method :: Method
  , path :: Path
  , headers :: Headers
  , m_bodies :: Maybe Bodies
  } deriving (Show)
data Method = GET | POST | Unknown deriving (Show, Eq)
newtype Path = Path [String] deriving (Show, Eq)
type Headers = [Header]
type Header = (BC.ByteString, BC.ByteString)
type Bodies = [Body]
type Body = BC.ByteString

type ContentDisposition = (BC.ByteString, ContentDispositions)
type ContentDispositions = [(BC.ByteString, BC.ByteString)]

data FormPart
  = FormFile
      { fi_fieldName :: String
      , fi_fileName  :: String
      , fi_content   :: BC.ByteString
      }
  | FormField
      { fie_fieldName :: String
      , fie_value     :: String
      }
  deriving (Show, Eq)

newtype FormData = FormData [FormPart]
  deriving (Show, Eq)

splitSubstring :: BC.ByteString -> BC.ByteString -> [BC.ByteString]
splitSubstring delim bs
  | BC.null bs = []
  | otherwise = go bs
  where
    go xs
      | BC.null xs = []
      | otherwise =
          let (pre, suf) = BC.breakSubstring delim xs
          in if BC.null suf
              then [pre]  -- 找不到 delim，就回傳最後一段
              else pre : go (BC.drop (BC.length delim) suf)

-- 這兩個函式互相遞迴
-- 會把 "(" -> "| "
--      ")"->" |"
-- 最後只要再調用parseUserAgent 分割" | "
takeUntilOpenParen :: String -> String
takeUntilOpenParen [] = []
takeUntilOpenParen ('(':xs) = '|' : ' ' : takeUntilCloseParen xs
takeUntilOpenParen (x:xs) = x : takeUntilOpenParen xs

takeUntilCloseParen :: String -> String
takeUntilCloseParen [] = []
takeUntilCloseParen (')':xs) = ' ' : '|' : takeUntilOpenParen xs
takeUntilCloseParen (x:xs) = x : takeUntilCloseParen xs

parseUserAgent :: String -> [String]
parseUserAgent str = splitOn " | " (takeUntilOpenParen str)

parsePath :: BC.ByteString -> Path
parsePath bs = Path $ map BC.unpack (filter (not . BC.null) (BC.split '/' bs)) -- filter把空的字串刪掉

-- lookupHeader lookupContentDisposition
lookupBSrS :: Eq k => [(k, BC.ByteString)] -> k -> Maybe String -- fmap 對容器內的元素map
lookupBSrS xs key = fmap BC.unpack (lookup key xs)

lookupBS :: Eq k => [(k, BC.ByteString)] -> k -> Maybe BC.ByteString -- fmap 對容器內的元素map
lookupBS xs key = lookup key xs

lookupInt :: [(String, String)] -> String -> Maybe Int
lookupInt xs key = readMaybe =<< lookup key xs

parseContentDisposition :: BC.ByteString -> (BC.ByteString, BC.ByteString)
parseContentDisposition str = (key, _value) -- 把"="drop掉
  where
    (key, after) = BC.breakSubstring (BC.pack "=") str
    _value = if after /= BC.empty then stripQuotes $ BC.drop 1 after else BC.empty
    -- 如果資料含雙引號 就去除
    stripQuotes s =
      if BC.length s >= 2 && BC.head s == '"' && BC.last s == '"'
        then BC.init $ BC.tail s
        else s

newContentDisposition :: BC.ByteString -> ContentDisposition
newContentDisposition str =
  case BC.split ';' str of
    [] -> (BC.empty, [])
    (dispositionType : sp_strs) -> (dispositionType, map parseContentDisposition $ stripStrs sp_strs)
  where
    stripStrs strs = map BC.strip strs

parseHeaders :: [BC.ByteString] -> Headers
parseHeaders headersStrList = catMaybes $ map parseHeader headersStrList -- catMaybes 把Nothing的項篩掉 並解掉Just層
  where
    parseHeader :: BC.ByteString -> Maybe Header
    parseHeader str =
      let (key, rest) = BC.break (== ':') str
      in if BC.null rest then Nothing else Just (key, BC.drop 2 rest)

splitHeadersAndBody :: [BC.ByteString] -> (Headers, Maybe Bodies)
splitHeadersAndBody xs = (parseHeaders headersStrList, m_bodies)
  where
    -- break會把不滿足條件的切開 直到第一個滿足條件的
    -- 所以在這裡 rest的第一項是空白行
    (headersStrList, xxs) = break (\line -> BC.all (`elem` "\r\n") line) xs
    m_bodies = case xxs of
      [] -> Nothing
      (_:bodies) -> Just bodies  -- 濾掉空白行


splitRequest :: BC.ByteString -> Either Request [Er.Error]
splitRequest req = do
  let reqList = BC.lines req -- BC.lines以'\n'切資料放進list
  if length reqList < 3 then -- 處理firstLine參數缺失
    Right [Error (Req_formatErr, "request format incorrect")]
  else case reqList of
    (firstLine:xs) ->
      case BC.words firstLine of
        -- 處理firstLine
        (method_ : path_ : _) ->
          Left request -- method=="GET" path=="/hello"
          where
            _method = case BC.unpack method_ of
              "GET" -> GET
              "POST" -> POST
              _ -> Unknown
            _path = parsePath path_
            (_headers, _m_bodies) = splitHeadersAndBody xs
            request = Request { method = _method, path = _path, headers = _headers, m_bodies = _m_bodies }
        _ -> Right [Er.Error (Req_firstLineFormatErr, "request-firstLine format incorrect")]
    _ -> Right [Er.Error (Req_formatErr, "request format incorrect")]

parseQuery :: String -> [(String, String)]
parseQuery qs = mapMaybe parseKV (splitOn "&" qs) -- mapMaybe只留下Just
  where
    parseKV :: String -> Maybe (String, String)
    parseKV s = case splitOn "=" s of
                  [k,v] -> Just (k,v)
                  _     -> Nothing

getQueryString :: String -> String
getQueryString url = case splitOn "?" url of
  [_] -> ""
  [_, qs] -> qs
  _ -> ""

-- 以下是處理POST的Multipart的HTTP解析
getBoundary :: Headers -> Maybe BC.ByteString
getBoundary _headers =
  case lookup (BC.pack "Content-Type") _headers of
    Just ct ->
      let
        marker = "boundary="
        -- BC.breakSubstring sub str 會從str找到sub切兩半
        -- 所以rest會是 "" 或是 "boundary=<boundaryCode>"
        (_, rest) = BC.breakSubstring (BC.pack marker) ct
      in
        if not $ BC.null rest
          -- 把"boundary="去掉
          then Just (BC.drop (length marker) rest)
          else Nothing
    Nothing -> Nothing

splitMultipart :: BC.ByteString -> BC.ByteString -> [(Headers, Maybe Bodies)]
splitMultipart boundary bodyWithEnd = map splitHeadersAndBody $ map BC.lines parts
  -- 在內文要拿來比對的boundary會比header的boundary開頭多"--"
  where
    endMarker = BC.concat [BC.pack "--", boundary, BC.pack "--\r\n"]
    splitMarker = BC.concat [BC.pack "--", boundary, BC.pack "\r\n"]
    (body, _) = BC.breakSubstring endMarker bodyWithEnd
    parts = filter (not . BC.null) $ splitSubstring splitMarker body

newFormPart :: (Headers, Maybe Bodies) -> Maybe FormPart
newFormPart (_headers, m_bodies) =
  case lookupBS _headers (BC.pack "Content-Disposition") of  -- 每段必須包含Content-Disposition 沒有就直接回傳Nothing
    Nothing -> Nothing
    Just cdStr ->
      let
        cd = newContentDisposition cdStr
        (_, cds) = cd
      in case lookupBS cds (BC.pack "name") of
        Nothing -> Nothing
        Just name ->
          case lookupBS cds (BC.pack "filename") of -- 有檔名就當檔案 沒檔名就當一般資料(String)
            Just _fileName ->
              Just $ FormFile
              { fi_fieldName = BC.unpack name
              , fi_fileName  = BC.unpack _fileName
              , fi_content   = body
              }
            Nothing ->
              Just $ FormField
              { fie_fieldName = BC.unpack name
              , fie_value   = BC.unpack body
              }
  where
    body = maybe BC.empty BC.concat m_bodies

--decodeJSON

parseMultiBody :: Headers -> Maybe Bodies -> [FormPart]
parseMultiBody _headers (Just body) = catMaybes $ formParts
  where
    formParts = case getBoundary _headers of
      Just boundary -> map newFormPart $ splitMultipart boundary (BC.concat body)
      Nothing -> []
parseMultiBody _ _ = []
