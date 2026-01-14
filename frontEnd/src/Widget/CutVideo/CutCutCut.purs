module Widget.CutVideo.CutCutCut where

import Prelude
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect.Console (log)
import Effect (Effect)
import Effect.Class (liftEffect)
import Data.Bifunctor (lmap)
import Control.Monad.Except.Trans (ExceptT(..), except, runExceptT, throwError, lift)
import Data.Newtype (unwrap)

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

import MyLibrary.Http.JSON (ApiResponse(..), ResultResponse(..), WCV_CCC_Result(..))
import Data.Argonaut.Decode (JsonDecodeError, decodeJson)
import Data.Argonaut.Core as JSON
import Affjax.RequestBody (json)

type Slot id = forall query. H.Slot query Output id

type Slots = ()

type Input = 
  { filePaths :: Array String
  , isOpTimeEnable :: Boolean
  , opTime :: String
  , isEdTimeEnable :: Boolean
  , edTime :: String
  }

data Output
  = Submit HandleState

data HandleState = Ready | Handling | Done | Done_Error

data Action
  = Initialize
  | Receive Input
  | ClickButton

type State = 
  { filePaths :: Array String
  , isOpTimeEnable :: Boolean
  , opTime :: String
  , isEdTimeEnable :: Boolean
  , edTime :: String
  , isCutComplete :: Boolean
  , message :: String
  }

initialState :: Input -> State
initialState input = 
  { filePaths: input.filePaths
  , isOpTimeEnable: input.isOpTimeEnable
  , opTime: input.opTime
  , isEdTimeEnable: input.isEdTimeEnable
  , edTime: input.edTime
  , isCutComplete: false
  , message: ""
  }

updateState :: Input -> forall m. H.HalogenM State Action () Output m Unit
updateState input =
  H.modify_ \st -> st
    { filePaths = input.filePaths
    , isOpTimeEnable = input.isOpTimeEnable
    , opTime = input.opTime
    , isEdTimeEnable = input.isEdTimeEnable
    , edTime = input.edTime
    }

component :: forall query m. MonadAff m => H.Component query Input Output m
component = -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState -- 柯里化 直接把input傳進initialState處理
    , render
    , eval: H.mkEval H.defaultEval
      { handleAction = handleAction
      , receive = Just <<< Receive -- 與父元件同步更新
      }  -- handleAction: 事件的主處理器
    }

render :: forall m. State -> H.ComponentHTML Action Slots m
render state = -- render呈現/繪製 構建HTML
  HH.div_
    [ HH.div_
        [ HH.button
          [ HE.onClick \_ -> ClickButton ]
          [ HH.text "開剪" ]
        ]
    , HH.div
        [ HP.style (if state.isCutComplete then "visibility: visible;" else "visibility: hidden;")] 
        [ HH.text ("剪輯結果：" <> state.message) ]
    ]

toJSONBody :: Array String -> Maybe AXRB.RequestBody
toJSONBody arr = Just $ json $ JSON.fromArray $ map JSON.fromString arr

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action () Output m Unit
handleAction action = case action of
  Initialize -> do
    H.raise $ Submit Ready
    H.liftEffect $ log "CutCutCut元件已初始化"

  Receive input -> do
    updateState input

  ClickButton -> do
    H.raise $ Submit Handling
    H.liftEffect $ log "Button 開剪"
    old_st <- H.get

    let
      arg_op = if old_st.isOpTimeEnable then old_st.opTime else ""
      arg_ed = if old_st.isEdTimeEnable then old_st.edTime else ""
    m_respond <- H.liftAff $ AX.request $ AX.defaultRequest
      { url = "http://127.0.0.1:10037/api/cut/cutCutCut/?" <> "op=" <> arg_op <> "&ed=" <> arg_ed
      , method = Left POST
      , responseFormat = AXRF.json -- 回傳內容用json格式解析
      , headers =
        [ AXRH.RequestHeader "Accept" "application/json"
        ]
      , content = toJSONBody old_st.filePaths -- body
      }

    exceptT <- runExceptT (doRespond m_respond)
    case exceptT of
      Right _ -> do
        H.raise $ Submit Done
        pure unit
      Left errMsg -> do
        H.modify_ \st -> st { message = errMsg }
        H.raise $ Submit Done_Error

    H.modify_ \st -> st 
      { isCutComplete = true
      }

-- doRespond 一層一層嘗試解包 成功的話型別會一直換
doRespond :: forall m. MonadAff m => Either AX.Error (AX.Response JSON.Json) -> ExceptT String (H.HalogenM State Action () Output m) Unit
doRespond e_respond = do 
  -- lmap 只對Bifunctor左側的值套函式 在這裡就是將Either的左邊轉成String
  -- ExceptT :: ExceptT (m (Either e a))
  respond <- except $
    lmap (\err -> "internet error: " <> printError err) e_respond -- 網路失敗

  apiResp <- except $
    lmap (\e -> "JSON decode error: " <> show e) (decodeJson respond.body :: Either JsonDecodeError ApiResponse) -- 解碼失敗

  rr <- except $ getRr apiResp
    
  let WCV_CCC_Result { error } = rr
  let ApiResponse { message, success, result } = apiResp
  if success then -- respond是否成功 包含404和業務邏輯錯誤
    H.modify_ \st -> st { message = message }
  else
    throwError
      $ "respond error: "
      <> message
      <> " errors: "
      <> error
  where
    getRr :: ApiResponse -> Either String WCV_CCC_Result
    getRr (ApiResponse { result }) =
      case result of
        Just (APICutCutCut rr) -> Right rr
        Just _ ->
          Left "result type error"
        Nothing ->
          Left "can't get result.result"