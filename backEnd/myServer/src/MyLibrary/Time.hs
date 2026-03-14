module MyLibrary.Time
  ( TimeFormat(..)
  ) where

data TimeFormat = FullTimestamp | TimeOfDay | Empty

instance Show TimeFormat where -- 資料夾名稱：<檔名>_<時間>
  show FullTimestamp  = "_%Y%m%d-%H%M%S"
  show TimeOfDay = "_%H%M%S"
  show Empty = ""