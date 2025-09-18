module Error
  ( ErrorCode(..)
  , Error(..)
  , defaultError
  ) where

data ErrorCode = Req_formatErr | Req_firstLineFormatErr | Req_methodErr | Api_funcOrArgErr | Api_FuncExecuteErr | ApiOS_err | ApiFile_fileNotFound | ApiUploadFile_fileIsAlreadyExist | Website_websiteNotFound | FileNotExist | UnexpectedError | ErrCodeNotInitialized deriving (Show, Eq)
data Error = Error
  { errCode :: ErrorCode
  , errMsg :: String
  }  deriving (Show, Eq)
  
defaultError :: Error
defaultError = Error
  { errCode = ErrCodeNotInitialized
  , errMsg  = "no errMsg"
  }

