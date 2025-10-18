module Cut.Main
  ( cutVideo
  ) where

import Cut.Cut as Cut
import qualified Cut.MakeCuts as MC

cut :: IO ()
cut = do
  result <- runExceptT $ Cut.cutVideo "input.mp4" "output.mp4" (Just 3) (Just 5)
  case result of
    Left err -> putStrLn $ "發生錯誤：\n" ++ err
    Right _ -> putStrLn "剪輯完成！"