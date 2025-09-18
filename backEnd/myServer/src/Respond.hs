module Respond
  ( Respond(..)
	, Headers(..)
	, Header(..)
	, FinalHeader(..)
	, defaultRespond
	, getFinalHeader
  , respond
  , respondMessage
  , respondFile
  ) where

import System.FilePath (takeFileName, takeExtension)
import System.Directory (doesFileExist)
    
import qualified Network.Socket as NS
import qualified Network.Socket.ByteString as NSB
import Control.Exception (SomeException, try)
    
import qualified Data.ByteString.Char8 as BC
import qualified Data.ByteString as BS
import Error as Er
import General
import qualified Http
import Http (DispositionType(Download))

returnErr = return . Just

type Headers = [Header]
type Header = (String, String)
type FinalHeader = [BC.ByteString]
getFinalHeader :: Headers -> FinalHeader
getFinalHeader headers = map toLine headers
  where toLine (k, v) = BC.pack (k ++ ": " ++ v)

data Respond = Respond
  { r_headers :: Headers
  , r_statusCode :: Http.StatusCode
  , r_body :: BC.ByteString -- 無論傳文字或二進位都是ByteString
  } deriving (Show, Eq)

defaultRespond :: Respond
defaultRespond = Respond
  { r_headers = []
  , r_statusCode = Http.SC404
  , r_body = BC.pack "-- http-body didn't initialized --"
  }

respond :: NS.Socket -> Respond -> IO (Maybe Error)
respond clientSocket respond_ = do
  let body = r_body respond_
      method = BC.pack "HTTP/1.1"
      firstLine = method <> BC.pack " "  <> case r_statusCode respond_ of
        Http.SC200 -> BC.pack "200 OK"
        Http.SC400 -> BC.pack "400 Bad Request"
        Http.SC404 -> BC.pack "404 Not Found"
      finalHeaders = getFinalHeader $ r_headers respond_ ++ [("Content-Length", show $ BC.length body)]
      finalRespond = BC.concat $ map (<> (BC.pack "\r\n")) $
          [firstLine] ++ finalHeaders ++ [BC.empty, body]
  
  result <- try (NSB.sendAll clientSocket finalRespond) :: IO (Either SomeException ())
  -- case result of
  --   Left e -> safePrint $ "Error sending file: " ++ show e
  --   Right _ -> safePrint "File response sent successfully"
  return Nothing

respondMessage :: NS.Socket -> Http.StatusCode -> BC.ByteString -> IO (Maybe Error)
respondMessage clientSocket statusCode message = do
  let headers = 
        [ ("Content-Type", "text/plain") -- 檔案類型 (大分類)/(副檔名)
        ]
      newRespond = defaultRespond { r_headers = headers, r_statusCode = statusCode, r_body = message }
  _ <- respond clientSocket newRespond
  return Nothing

respondFile :: NS.Socket -> FilePath -> Http.DispositionType -> IO (Maybe Error)
respondFile clientSocket filePath dType = do
  exists <- doesFileExist filePath
  if not exists then
    returnErr defaultError { errCode = FileNotExist, errMsg = "file not exist\nfilePath: " ++ show filePath}
  else do
    content <- BS.readFile filePath
    let fileName = takeFileName filePath
        fileExtension = takeExtension fileName
        conDis = [ Http.DispositionType dType, Http.Filename fileName, Http.newFilenameStar fileName]
        headers = 
          [ ("Content-Type", Http.mimeType fileExtension) -- 檔案類型 (大分類)/(副檔名)
          , Http.renderConDis conDis
          ]
        newRespond = defaultRespond { r_headers = headers, r_statusCode = Http.SC200, r_body = content }
    _ <- respond clientSocket newRespond
    return Nothing