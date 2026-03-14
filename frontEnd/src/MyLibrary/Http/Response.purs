module MyLibrary.Http.Response
  ( getFilename, getDispositionType, getCreationDate, getModDate, getSize
  , parseConDisRH, parseConDis, ConDis, DispositionType(..)
  ) where

import Prelude
import Data.Int (fromString)
import Data.Array (find, index)
import Data.Maybe (Maybe(..), isJust, fromMaybe)
import Data.String.CodePoints as CP
import Data.String.CodeUnits (toCharArray)
import Data.String.NonEmpty.CodeUnits (charAt, fromCharArray)
import Data.String.NonEmpty.Internal (NonEmptyString)

import JSURI (decodeURIComponent)
import Data.String.Common (split, trim)
import Data.String.Pattern (Pattern(..))

import Affjax.ResponseHeader as AXRpH

data DispositionType = Inline | Attachment
derive instance eqDispositionType :: Eq DispositionType

type ConDis = 
  { dispositionType :: Maybe DispositionType -- 檢視或下載
  , filename        :: Maybe String          -- Filename/Filename*擇一
  , creationDate    :: Maybe String          -- 建檔時間
  , modDate         :: Maybe String          -- 最後修改時間
  , size            :: Maybe Int             -- bytes
  }
  
getDispositionType :: ConDis -> Maybe DispositionType
getDispositionType = \conDis -> conDis.dispositionType

getFilename :: ConDis -> Maybe String
getFilename = \conDis -> conDis.filename

getCreationDate :: ConDis -> Maybe String
getCreationDate = \conDis -> conDis.creationDate

getModDate :: ConDis -> Maybe String
getModDate = \conDis -> conDis.modDate

getSize :: ConDis -> Maybe Int
getSize = \conDis -> conDis.size

parseConDisRH :: Array AXRpH.ResponseHeader -> String
parseConDisRH headers = fromMaybe "" m_conDis
  where
    m_conDis = -- find找到第一個符合的值 map純為了處理Maybe
      map (\(AXRpH.ResponseHeader _ value) -> value) $
        find (\(AXRpH.ResponseHeader k _) -> k == "Content-Disposition") headers


toNonEmptyString :: String -> Maybe NonEmptyString
toNonEmptyString = fromCharArray <<< toCharArray

-- 去掉頭尾引號
stripQuotes :: String -> String
stripQuotes s = -- CP CodePoints.length用視覺字元數而不是UTF-16
  case toNonEmptyString s of -- 轉成NonEmptyString 才能用NonEmpty.CodeUnits.charAt
    Nothing -> s
    Just ns ->
      if CP.length s >= 2 && charAt 0 ns == Just '"' && charAt (CP.length s - 1) ns == Just '"'
        then CP.drop 1 (CP.take (CP.length s - 1) s)
        else s

parseConDis :: String -> ConDis
parseConDis conDisStr =
  { dispositionType: parseDispositionType -- 檢視或下載
  , filename: parseFileName          -- Filename/Filename*擇一
  , creationDate: parseCreationDate          -- 建檔時間
  , modDate: parseModDate          -- 最後修改時間
  , size: parseSize             -- bytes
  }
  where
    conDisStrArr = map trim $ split (Pattern ";") conDisStr -- 切割並濾掉頭尾空格
    params = map (map trim) $ map (split (Pattern "=")) conDisStrArr -- [["inline"], ["filename","abc.txt"], ...]
    
    parseDispositionType :: Maybe DispositionType
    parseDispositionType =
      case find (\arr -> arr `index` 0 == Just "inline") params of -- index是回傳Maybe 避免空指針
        Just _ -> Just Inline
        Nothing -> case find (\arr -> arr `index` 0 == Just "attachment") params of
          Just _ -> Just Attachment
          Nothing -> Nothing

    parseFileName :: Maybe String
    parseFileName = 
      case find (\arr -> arr `index` 0 == Just "filename*" && isJust (arr `index` 1)) params of
        Just arr -> 
          let
            encoded = case arr `index` 1 of
              Just s -> stripQuotes s
              Nothing -> "" -- 不會發生 因為前面有檢查isJust
          in decodeURIComponent $ dropPrefix encoded -- decodeURIComponent回傳Maybe String
        Nothing ->
          case find (\arr -> arr `index` 0 == Just "filename" && isJust (arr `index` 1)) params of
            Just arr -> case arr `index` 1 of
              Just s -> Just $ stripQuotes s
              Nothing -> Nothing -- 不會發生 因為前面有檢查isJust
            Nothing -> Nothing
      where
        dropPrefix :: String -> String
        dropPrefix s =
            -- RFC 5987 格式: UTF-8''filename
            case split (Pattern "UTF-8''") s `index` 1 of
              Just str -> str
              _ -> s

    parseCreationDate :: Maybe String
    parseCreationDate = -- 檢查index_0是對的字串 && 檢查index_1存在
      case find (\arr -> arr `index` 0 == Just "creation-date" && isJust (arr `index` 1)) params of
        Just arr -> stripQuotes <$> arr `index` 1 -- <$>是map的infix版本 解包Maybe
        _ -> Nothing

    parseModDate :: Maybe String
    parseModDate =
      case find (\arr -> arr `index` 0 == Just "modification-date" && isJust (arr `index` 1)) params of
        Just arr -> stripQuotes <$> arr `index` 1
        _ -> Nothing

    parseSize :: Maybe Int
    parseSize =
      case find (\arr -> arr `index` 0 == Just "size" && isJust (arr `index` 1)) params of
        Just arr -> case arr `index` 1 of
          Just s -> fromString $ stripQuotes s
          Nothing -> Nothing -- 不會發生 因為前面有檢查isJust
        _ -> Nothing
