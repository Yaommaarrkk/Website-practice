module Http
  ( mimeType
  , OS (..)
  , StatusCode (..)
  , DispositionType (..)
  , ConDisParam(..)
  , newFilenameStar
  , renderConDis
  ) where

import Network.URI.Encode (encode)
import Data.List (intercalate)

mimeType :: String -> String
mimeType ext = case ext of
  ".html" -> "text/html"
  ".htm"  -> "text/html"
  ".css"  -> "text/css"
  ".js"   -> "application/javascript"
  ".json" -> "application/json"
  ".png"  -> "image/png"
  ".jpg"  -> "image/jpeg"
  ".jpeg" -> "image/jpeg"
  ".gif"  -> "image/gif"
  ".svg"  -> "image/svg+xml"
  ".pdf"  -> "application/pdf"
  ".txt"  -> "text/plain"
  ".xml"  -> "application/xml"
  ".zip"  -> "application/zip"
  ".mp3"  -> "audio/mpeg"
  ".mp4"  -> "video/mp4"
  _       -> "application/octet-stream" -- 預設二進位檔案類型


data OS = Windows | MacOS | IOS | Linux | Android deriving (Show, Eq)

data StatusCode = SC200 | SC400 | SC404 deriving (Show, Eq)

data DispositionType = View | Download deriving (Eq)
instance Show DispositionType where
  show View = "inline"
  show Download = "attachment"

data ConDisParam
  = DispositionType DispositionType -- 檢視或下載
  | Filename String -- 傳統ASCII編碼
  | FilenameStar String -- 指定編碼 新瀏覽器常用
  | CreationDate String -- 建檔時間
  | ModDate String -- 最後修改時間
  | Size Int -- bytes
  | OtherParam String String
  deriving (Eq)

-- parseConDisParam :: String -> ConDisParam
-- parseConDisParam str = 

newFilenameStar :: String -> ConDisParam
newFilenameStar fn = FilenameStar ("UTF-8''" <> encode fn)

instance Show ConDisParam where
  show param = case param of
    DispositionType t -> show t
    Filename name -> "filename=\"" <> name <> "\""
    FilenameStar name -> "filename*=\"" <> name <> "\""
    CreationDate d -> "creation-date=\"" ++ d ++ "\""
    ModDate d -> "modification-date=\"" ++ d ++ "\""
    Size n -> "size=" ++ show n
    OtherParam k v -> k <> "=" <> v

renderConDis :: [ConDisParam] -> (String, String)
renderConDis params = ("Content-Disposition", intercalate "; " (map show params)) --插入連接字串並合併陣列