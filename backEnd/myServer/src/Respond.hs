{-# LANGUAGE DeriveGeneric #-}

module Respond
  ( Response (..),
    Headers,
    Header,
    FinalHeader,
    getFinalHeader,
    respondJSON,
    respondError,
    respondMessage,
    buildResponseFile,
    ResponseJSON (..),
    ResponseFile (..),
  )
where

import Control.Exception (SomeException, try)
import Data.Aeson (FromJSON, ToJSON, encode)
import qualified Data.ByteString.Char8 as BC
import qualified Data.ByteString.Lazy as BL
import Error as Er
import GHC.Generics (Generic)
import General
import qualified Http
import qualified Network.Socket as NS
import qualified Network.Socket.ByteString as NSB
import System.Directory (doesFileExist)
import System.FilePath (takeExtension, takeFileName)

type Headers = [Header]

type Header = (String, String)

type FinalHeader = [BC.ByteString]

getFinalHeader :: Headers -> FinalHeader
getFinalHeader headers = map toLine headers
  where
    toLine (k, v) = BC.pack (k ++ ": " ++ v)

data Response = Response
  { r_headers :: Headers,
    r_statusCode :: Http.StatusCode,
    r_body :: BL.ByteString -- BL是lazy 不會塞爆記憶體
  }
  deriving (Show, Eq)

data ResponseJSON a = ResponseJSON
  { success :: Bool,
    message :: String,
    r_type :: String, -- 自訂type 給前端對應result用
    result :: Maybe a
  }
  deriving (Show, Eq, Generic) -- Generic允許編譯器自動推導型別

instance ToJSON a => ToJSON (ResponseJSON a) -- 限制當a可以ToJSON時，(ResponseJSON a)也可以ToJSON

instance FromJSON a => FromJSON (ResponseJSON a)

data ResponseFile = ResponseFile
  { r_fileName :: String,
    r_fileBody :: BL.ByteString,
    r_conDisParams :: Http.ConDis
  }
  deriving (Show, Eq)

respond :: NS.Socket -> Response -> Logger -> IO [Error] -- 最終respond 前一層為respondJSON或respondFile
respond clientSocket (Response headers statusCode body) logger = do
  let firstLine = BC.pack ("HTTP/1.1 " <> show statusCode)
      finalHeaders = getFinalHeader $ headers ++ [("Content-Length", show $ BL.length body)]
      finalResponse =
        BC.concat $
          map (<> (BC.pack "\r\n")) $
            [firstLine] ++ finalHeaders ++ [BC.empty]

  resultHeader <- try (NSB.sendAll clientSocket finalResponse) :: IO (Either SomeException ())
  resultBody <- try $ mapM_ (NSB.sendAll clientSocket) (BL.toChunks body) :: IO (Either SomeException ())
  case (resultHeader, resultBody) of
    (Left e, _) -> logger $ "Error sending header: " ++ show e
    (_, Left e) -> logger $ "Error sending body: " ++ show e
    _ -> logger "Response sent successfully"
  return []

respondJSON :: ToJSON a => NS.Socket -> ResponseJSON a -> Http.StatusCode -> Logger -> IO [Error]
respondJSON clientSocket responseJSON statusCode = respond clientSocket response
  where
    response =
      Response
        { r_headers = [("Content-Type", "application/json; charset=utf-8")], -- 檔案類型 (大分類)/(副檔名)
          r_statusCode = statusCode,
          r_body = encode responseJSON -- encode 轉JSON 回傳lazyBS
        }

respondFile :: NS.Socket -> ResponseFile -> Logger -> IO [Error]
respondFile clientSocket (ResponseFile fileName fileBody conDisParams) = respond clientSocket response
  where
    response =
      Response
        { r_headers =
            [ ("Content-Type", Http.mimeType $ takeExtension fileName), -- 檔案類型 (大分類)/(副檔名)
              ("Content-Disposition", show conDisParams)
            ],
          r_statusCode = Http.SC200,
          r_body = fileBody
        }

respondError :: NS.Socket -> Http.StatusCode -> String -> Logger -> IO [Error] -- 協定錯誤 做好給respondJSON
respondError clientSocket statusCode errMsg logger = do
  let responseJSON :: ResponseJSON () -- 型別設空
      responseJSON =
        ResponseJSON
          { success = False,
            message = errMsg, -- 變懶
            r_type = "",
            result = Nothing
          }
  respondJSON clientSocket responseJSON statusCode logger

respondMessage :: NS.Socket -> Bool -> String -> Logger -> IO [Error] -- 傳訊息或業務邏輯錯誤 做好給respondJSON
respondMessage clientSocket isSuccess msg logger = do
  let responseJSON :: ResponseJSON ()
      responseJSON =
        ResponseJSON
          { success = isSuccess,
            message = msg, -- 變懶
            r_type = "",
            result = Nothing
          }
  respondJSON clientSocket responseJSON Http.SC200 logger

buildResponseFile :: NS.Socket -> FilePath -> Http.DispositionType -> Logger -> IO [Error] -- 做好給respondFile
buildResponseFile clientSocket filePath dType logger = do
  exists <- doesFileExist filePath
  if not exists
    then return [Error (FileNotExist, "file not exist\nfilePath: " ++ show filePath)]
    else do
      content <- BL.readFile filePath
      let responseFile =
            ResponseFile
              { r_fileName = fileName,
                r_fileBody = content,
                r_conDisParams = Http.ConDis [Http.DispositionType dType, Http.Filename fileName, Http.newFilenameStar fileName]
              }
            where
              fileName = takeFileName filePath
      respondFile clientSocket responseFile logger