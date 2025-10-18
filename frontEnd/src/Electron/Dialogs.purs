module Electron.Dialogs where

import Prelude
import Effect (Effect)
import Promise.Internal (Promise)

type OpenFileResult = { canceled :: Boolean, filePaths :: Array String }

foreign import openFile :: Effect (Promise OpenFileResult)