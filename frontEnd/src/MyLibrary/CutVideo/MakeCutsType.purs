module MyLibrary.CutVideo.MakeCutsType where

import Prelude
import Data.Either (Either(..))
import Data.Map as Map
import Data.Map (Map)
import Data.Array (fromFoldable)
import Data.List (length, filter)
import Data.Generic.Rep (class Generic)
import Data.Tuple (Tuple(..))
import Data.Argonaut.Decode.Class (class DecodeJson, decodeJson)
import Data.Argonaut.Decode.Decoders (decodeString)
import Data.Argonaut.Decode.Error (JsonDecodeError(..))
import Data.Argonaut.Core (Json(..))

type JobMap
  = Map.Map VideoName Job

type Job
  = { videoName :: String
    , state :: JobState -- Waiting | Processing | Done | Error
    , outputDir :: String
    , totalFrames :: Int
    }

type VideoName
  = String

data JobState
  = Waiting
  | Processing
  | Done
  | Error

derive instance eqJobState :: Eq JobState

derive instance ordJobState :: Ord JobState

instance showJobState :: Show JobState where
  show Waiting = "Waiting"
  show Processing = "Processing"
  show Done = "Done"
  show Error = "Error"

instance decodeJobState :: DecodeJson JobState where
  decodeJson json = do
    s <- decodeString json -- Left就回傳 Right就拆包並繼續
    case s of
      "Waiting" -> pure Waiting
      "Processing" -> pure Processing
      "Done" -> pure Done
      "Error" -> pure Error
      _ -> Left $ TypeMismatch s

getDone :: JobMap -> Int
getDone jobMap = length $ filter (\job -> job.state == Done) $ Map.values jobMap

getFailCount :: JobMap -> Int
getFailCount jobMap = length $ filter (\job -> job.state == Error) $ Map.values jobMap

getTotal :: JobMap -> Int
getTotal jobMap = Map.size jobMap

mkJobMap :: Array VideoName -> JobMap
mkJobMap names = Map.fromFoldable $ fromFoldable $ map (\key -> Tuple key { videoName: key, state: Waiting, outputDir: "", totalFrames: 0 }) names
