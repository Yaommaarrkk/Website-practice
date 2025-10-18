module MyLibrary.Http.JSON
  ( ApiResponse(..), ResultResponse(..), WFD_Result(..), WDI_Result(..), WVF_Result(..), WCV_Result(..)
  ) where

import Prelude
import Data.Argonaut (Json)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.:))
import Data.Maybe (Maybe(..))
import Data.Either (Either(..))

newtype WFD_Result = WFD_Result { userDevice :: String }
newtype WDI_Result = WDI_Result { result :: String }
newtype WVF_Result = WVF_Result { fileName :: String, fileContent :: String }
newtype WCV_Result = WCV_Result { tempDirPath :: String }

data ResultResponse
  = APIFetchDevice WFD_Result
  | APIDoubleInput WDI_Result --好像未啟用
  | APIViewFile WVF_Result --好像未啟用
  | APICutVideo WCV_Result

newtype ApiResponse = ApiResponse
  { message :: String
  , result :: Maybe ResultResponse
  , success :: Boolean
  }

decodeResult :: String -> Json -> Maybe ResultResponse
decodeResult "APIFetchDevice" json = APIFetchDevice <$> eitherToMaybe (decodeJson json) -- 在這裡建構物件 decodeJson只須回傳record
decodeResult "APIDoubleInput" json = APIDoubleInput <$> eitherToMaybe (decodeJson json)
decodeResult "APIReadFile"    json = APIViewFile <$> eitherToMaybe (decodeJson json)
decodeResult "APICutVideo"    json = APICutVideo <$> eitherToMaybe (decodeJson json)
decodeResult _ _ = Nothing

eitherToMaybe :: forall a b. Either a b -> Maybe b
eitherToMaybe (Right x) = Just x
eitherToMaybe (Left _)  = Nothing

instance decodeDeviceResult :: DecodeJson WFD_Result where
  decodeJson json = do
    obj <- decodeJson json
    userDevice <- obj .: "userDevice"
    pure $ WFD_Result { userDevice }

instance decodeInputResult :: DecodeJson WDI_Result where
  decodeJson json = do
    obj <- decodeJson json
    result <- obj .: "result"
    pure $ WDI_Result { result }

instance decodeFileResult :: DecodeJson WVF_Result where
  decodeJson json = do
    obj <- decodeJson json
    fileName <- obj .: "fileName"
    fileContent <- obj .: "fileContent"
    pure $ WVF_Result { fileName, fileContent }

instance decodeCutVideo :: DecodeJson WCV_Result where
  decodeJson json = do
    obj <- decodeJson json
    tempDirPath <- obj .: "tempDirPath"
    pure $ WCV_Result { tempDirPath }

instance decodeApiResponse :: DecodeJson ApiResponse where -- DecodeJson會自動找到對應的解碼器
  decodeJson json = do
    obj <- decodeJson json
    t <- obj .: "r_type"
    message <- obj .: "message"
    rawResult <- obj .: "result"
    success <- obj .: "success"
    result <- pure $ decodeResult t rawResult -- 依照r_type去解析result
    pure $ ApiResponse { message, result, success }
