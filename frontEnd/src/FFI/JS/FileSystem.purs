module FFI.JS.FileSystem where

import Effect (Effect)

type FileInfo =
  { name  :: String
  , isDir :: Boolean
  }

foreign import readDir :: String -> Effect (Array FileInfo)