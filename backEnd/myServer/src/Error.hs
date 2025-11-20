{-# LANGUAGE InstanceSigs #-}
module Error
  ( ErrorCode(..)
  , Error(..)
  , GetSC(getSC)
  ) where

import qualified Http

data ErrorCode
  -- BusinessError
  = Api_FuncExecuteErr 
  | ApiOS_err | ApiFile_fileNotFound | ApiUploadFile_fileIsAlreadyExist 
  | UnexpectedError | ErrCodeNotInitialized
  -- ProtocolError
  | Req_formatErr | Req_firstLineFormatErr | Req_methodErr | Api_funcOrArgErr 
  | FileNotExist | Website_websiteNotFound
  -- HandleVideoError
  | ApiMakeCuts_err | ApiCut_err
  deriving (Show, Eq)

newtype Error = Error (ErrorCode, String)

instance Show Error where
  show :: Error -> String
  show (Error (code, msg)) = "error: " ++ show code ++ ", errorMsg: " ++ msg ++ "\n"

class GetSC a where
  getSC :: a -> Http.StatusCode
instance GetSC ErrorCode where
  getSC :: ErrorCode -> Http.StatusCode
  getSC code = case code of 
    Api_FuncExecuteErr -> Http.SC200
    ApiOS_err -> Http.SC200
    ApiFile_fileNotFound -> Http.SC200
    ApiUploadFile_fileIsAlreadyExist -> Http.SC200

    ApiMakeCuts_err -> Http.SC200
    ApiCut_err -> Http.SC200

    UnexpectedError -> Http.SC500
    ErrCodeNotInitialized -> Http.SC500
    
    Req_formatErr -> Http.SC400
    Req_firstLineFormatErr -> Http.SC400
    Req_methodErr -> Http.SC400
    Api_funcOrArgErr -> Http.SC400
    FileNotExist -> Http.SC404
    Website_websiteNotFound -> Http.SC404
instance GetSC Error where -- 多載
  getSC (Error (errorCode, _)) = getSC errorCode

