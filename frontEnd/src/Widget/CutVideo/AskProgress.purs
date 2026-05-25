module Widget.CutVideo.AskProgress where

import Prelude
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Foldable (foldl)
import Data.Map as Map
import Effect.Console (log, logShow)
import Effect.Class (liftEffect)
import Data.Argonaut.Core (stringify)
import Data.Bifunctor (lmap)
import Data.Time.Duration (Milliseconds(..))
import Control.Monad (void, when)
import Control.Monad.Rec.Class (forever)
import Effect.Aff (delay)
import Control.Monad.Except.Trans (ExceptT(..), except, runExceptT, throwError, lift)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Affjax.Web as AX
import Affjax (printError)
import Affjax.ResponseFormat as AXRF
import Affjax.RequestHeader as AXRH
import Affjax.RequestBody as AXRB
import Effect.Console (log)
import Data.HTTP.Method (Method(..))
import MyLibrary.General (serverUrl)
import MyLibrary.Http.JSON (ApiResponse(..), ResultResponse(..), WCV_AP_Result(..))
import Data.Argonaut.Decode (JsonDecodeError, decodeJson)
import Data.Argonaut.Core as JSON
import Affjax.RequestBody (json)
import MyLibrary.CutVideo.MakeCutsType as McType

type Slot id
  = forall query. H.Slot query Output id

type Slots
  = ()

-- type Input = Maybe InputData
-- type InputData = 
--   { requestID :: String
--   }
type Input
  = { requestID :: String
    , videoNames :: Array String
    }

data Output
  = Msg String
  | VideoTable McType.JobMap
  | Done

data Action
  = Initialize
  | Receive Input
  | SendRequest

type State
  = { requestID :: String
    , videoNames :: Array String
    , isComplete :: Boolean
    , videoTable :: McType.JobMap
    }

updateState :: Input -> forall m. H.HalogenM State Action Slots Output m Unit
updateState input =
  H.modify_ \st ->
    st
      { requestID = input.requestID
      , videoNames = input.videoNames
      , videoTable =
          if input.requestID /= st.requestID then
            McType.mkJobMap input.videoNames
          else
            st.videoTable
      }

component :: forall query m. MonadAff m => H.Component query Input Output m
component =  -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState -- 柯里化 直接把input傳進initialState處理
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , receive = Just <<< Receive -- 與父元件同步更新
            } -- handleAction: 事件的主處理器
    }
  where
  initialState :: Input -> State
  initialState input =
    { requestID: input.requestID
    , videoNames: input.videoNames
    , videoTable: McType.mkJobMap input.videoNames
    , isComplete: false
    }

render :: forall m. State -> H.ComponentHTML Action Slots m
render state = HH.div_ [] -- render呈現/繪製 構建

toJSONBody :: Array String -> Maybe AXRB.RequestBody
toJSONBody arr = Just $ json $ JSON.fromArray $ map JSON.fromString arr

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action Slots Output m Unit
handleAction action = case action of
  Initialize -> do
    pure unit
    H.raise $ Msg "上傳中..."
    H.liftEffect $ log "AskProgress元件已初始化"
    void
      $ H.fork do
          go
    where
    go = do
      st <- H.get
      when (not st.isComplete) do
        handleAction SendRequest
        H.liftAff $ delay (Milliseconds 1000.0)
        go
  -- Receive (Just inputData) -> do
  --   updateState inputData
  -- Receive Nothing -> do
  --   pure unit
  Receive input -> do
    updateState input
  SendRequest -> do
    old_st <- H.get
    -- H.liftEffect $ log "AskProgress丟request"
    m_respond <-
      H.liftAff $ AX.request
        $ AX.defaultRequest
            { url = serverUrl <> "/api/cut/askProgress/?" <> "requestID=" <> old_st.requestID
            , method = Left GET
            , responseFormat = AXRF.json -- 回傳內容用json格式解析
            , headers =
              [ AXRH.RequestHeader "Accept" "application/json"
              ]
            }
    -- H.liftEffect $ log "AskProgress收response"
    exceptT <- runExceptT (doRespond m_respond)
    case exceptT of
      Right msg -> do
        H.raise $ Msg msg
      Left errMsg -> do
        H.raise $ Msg errMsg
    st <- H.get
    H.raise $ VideoTable st.videoTable
    when st.isComplete do
      H.raise Done

doRespond :: forall m. MonadAff m => Either AX.Error (AX.Response JSON.Json) -> ExceptT String (H.HalogenM State Action Slots Output m) String
doRespond e_respond = do
  -- lmap 只對Bifunctor左側的值套函式 在這裡就是將Either的左邊轉成String
  -- ExceptT :: ExceptT (m (Either e a))
  respond <-
    except
      $ lmap (\err -> "internet error: " <> printError err) e_respond -- 網路失敗
  apiResp <-
    except
      $ lmap (\e -> "JSON decode error: " <> show e) (decodeJson respond.body :: Either JsonDecodeError ApiResponse) -- 解碼失敗
  let
    ApiResponse r = apiResp
  rr <- except $ getRr apiResp
  let
    WCV_AP_Result { updateJobs, isComplete } = rr
  let
    ApiResponse { message, success, result } = apiResp
  if success then do -- respond是否成功 包含404和業務邏輯錯誤
    -- liftEffect $ logShow rr.tempDirPath
    lift
      $ H.modify_ \st ->
          st
            { isComplete = isComplete
            , videoTable = foldl (\m job -> Map.insert job.videoName job m) st.videoTable updateJobs
            }
    pure message
  else
    throwError
      $ "message: "
      <> message
  where
  getRr :: ApiResponse -> Either String WCV_AP_Result
  getRr (ApiResponse { result }) = case result of
    Just (APIAskProgress rr) -> Right rr
    Just _ -> Left "result type error"
    Nothing -> Left "can't get result.result"
