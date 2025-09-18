module Foreign.Browser.URL where

import Effect (Effect)
import Web.File.Blob (Blob)


foreign import getCurrentURL :: Blob -> Effect String