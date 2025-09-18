{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE BlockArguments #-}

module Main (main) where

import System.IO (BufferMode (NoBuffering), hSetBuffering, stderr, stdout, hSetEncoding, utf8)
import System.Directory (setCurrentDirectory, getCurrentDirectory)
import System.FilePath (takeDirectory)


import Control.Monad (forever)
import Control.Concurrent (forkIO)
import qualified Data.ByteString.Char8 as BC
import qualified Network.Socket as NS
import qualified Network.Socket.ByteString as NSB

import qualified Request as Rq
import qualified Respond as Rp
import qualified API
import qualified Http
import Error as Er

import General
returnErr = return . Just


handleRequest :: NS.Socket -> BC.ByteString -> IO (Maybe Error)
handleRequest clientSocket req = do
  safePrint $ "Handling request: " ++ BC.unpack req
  let e_request = Rq.splitRequest req
  case e_request of
    Left request -> API.handleURL clientSocket request -- 傳入處理好的Request
    Right err -> returnErr err

recvRequest :: NS.Socket -> BC.ByteString -> IO BC.ByteString
recvRequest socket buffer = do
  chunk <- NSB.recv socket 4096 -- 接收4096bytes資料 沒資料會等資料來 return-ByteString
  if "\r\n\r\n" `BC.isInfixOf` chunk
    then return (buffer <> chunk)
    else recvRequest socket (buffer <> chunk)


handleClient :: NS.Socket -> IO ()
handleClient clientSocket = do
  req <- recvRequest clientSocket BC.empty
  -- safePrint $ "Received request: " ++ BC.unpack req
  m_Err <- handleRequest clientSocket req

  case m_Err of
    Nothing -> return ()
    Just err -> do
      _ <- Rp.respondMessage clientSocket Http.SC404 (BC.pack $ errMsg err)
      safePrint $ "error: " ++ (show $ errCode err)
      safePrint $ "errorMsg: " ++ errMsg err ++ "\n"
      return ()
  NS.close clientSocket

main :: IO ()
main = do
  hSetEncoding stdout utf8
  hSetBuffering stdout NoBuffering
  hSetBuffering stderr NoBuffering

  -- 從haskell專案路徑 上移兩層到總專案路徑
  dir <- getCurrentDirectory
  let cwd = takeDirectory $ takeDirectory dir
  setCurrentDirectory cwd

  let host = "127.0.0.1"
      port = "10037"

  -- BC是ByteString.Char8
  -- 在這裡用ByteString取代String
  -- 高效函式庫多用ByteString或Text
  -- BC.pack 將String轉ByteString
  -- <>是字串連接 相當於String的++
  safePrint $ "Listening on " ++ host ++ ":" ++ port

  -- getAddrInfo會根據三個參數作為條件 跟系統要資源 會回傳可行的組合(得到多筆的AddrInfo)
  -- getAddrInfo :: Maybe AddrInfo -> Maybe HostName > Maybe ServiceName -> IO [AddrInfo]
  -- AddrInfo涵蓋所有資訊 用於之後綁定和連線
  -- data AddrInfo = AddrInfo
  -- { addrFlags     :: [AddrInfoFlag]   -- 控制查詢或使用方式的 flags
  -- , addrFamily    :: Family           -- 協定族群，例：AF_INET（IPv4）
  -- , addrSocketType :: SocketType      -- socket 類型，例：Stream（TCP）
  -- , addrProtocol  :: ProtocolNumber   -- 協定編號（通常 defaultProtocol）
  -- , addrAddress   :: SockAddr         -- 實際 IP 與 port
  -- , addrCanonName :: Maybe String     -- 正規主機名稱（可為 Nothing）
  -- }
  -- type HostName = String
  -- type ServiceName = String
  -- 這次AddrInfo不限制 用IP/port過濾
  addrInfo <- NS.getAddrInfo Nothing (Just host) (Just port)
  addr <- case addrInfo of -- 從所有可用方案addrInfo內拿第一個
    [] -> error "error: No address info found"
    (x:_) -> return x

  -- socket :: Family -> SocketType -> ProtocolNumber -> IO Socket
  -- Family(型別ADT) 拿addrInfo的head也就是AddrInfo 裡面的addrFamily(IPv4)項
  -- SocketType(型別ADT) Stream:TCP / Datagram:UDP
  -- ProtocolNumber(WORD32) TCP/UDP底下的協定 這邊用Network.Socket底下的defaultProtocol 也就是預設0
  serverSocket <- NS.socket (NS.addrFamily addr) NS.Stream NS.defaultProtocol

  -- bind :: Socket -> SockAddr -> IO ()
  -- 讓系統把socket綁在給定的IP/port上
  -- 從該方案中取得IP/port(addrAddress)
  NS.bind serverSocket (NS.addrAddress addr)

  -- listen :: Socket -> Int -> IO ()
  -- Int填最多排隊長度
  NS.listen serverSocket 10

  -- 無限迴圈
  forever $ do
    (clientSocket, clientAddr) <- NS.accept serverSocket
    safePrint $ "Accepted connection from " ++ (show clientAddr) ++ "."
    _ <- forkIO $ handleClient clientSocket -- forkIO會回傳IO ThreadId
    return ()
