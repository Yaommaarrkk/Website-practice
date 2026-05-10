module MyLibrary.Threads
  ( createGlobalSem,
    takeSemaphoreAndRun,
  )
where

import Control.Concurrent (QSem, newQSem, signalQSem, waitQSem)
import Control.Exception (bracket_)

createGlobalSem :: Int -> IO QSem
createGlobalSem n = do newQSem n -- 建立池 最多同時n個人拿鑰匙

-- data QSem = QSem
--   { counter :: IORef Int -- 剩餘可用資源數
--   , queue   :: MVar [MVar ()] -- 待做的工作
--   }
-- waitQSem -- 有counter就通過 沒counter就建MVar並加入queue
-- signalQSem sem -- 看queue有action就拿一個來執行 沒人就counter+1

takeSemaphoreAndRun :: QSem -> IO a -> IO a
takeSemaphoreAndRun globalSem action =
  bracket_
    (waitQSem globalSem) -- 拿鑰匙
    (signalQSem globalSem) -- 還鑰匙
    action -- 執行工作
