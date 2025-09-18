module Widget.UploadFile where

import Prelude
import Data.Either (Either(..))
import Data.HTTP.Method (Method(..))
import Data.Array (find)
import Data.Maybe (fromMaybe)

import Effect.Aff.Class (class MonadAff)

import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

import Affjax.Web as AX
import Affjax (printError)
import Affjax.ResponseFormat as AXRF
import Affjax.ResponseHeader as AXRpH
import Affjax.RequestHeader as AXRH

type Slot id = H.Slot Query Output id

data Query a
  = QueryUnit

data Output
  = Submit String
  | Error String

data Action
  = Initialize
  | InputChanged String
  | ClickButton

type State = { input :: String, message :: String }

component :: forall query input m. MonadAff m => H.Component query input Output m
component = -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState: const { input: "", message: "(--)" }
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }  -- handleAction: 事件的主處理器
    }

render :: forall m. State -> H.ComponentHTML Action () m
render state = -- render呈現/繪製 構建HTML
  HH.div_
    [ HH.input
      [ HP.value state.input
      , HE.onValueInput \s -> InputChanged s
      ]
    , HH.button
      [ HE.onClick \_ -> ClickButton ]
      [ HH.text "下載" ]
    , HH.p_ [ HH.text ("結果：" <> state.message)]
    ]

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action () Output m Unit
handleAction action = case action of
  Initialize -> pure unit

  InputChanged s -> do
    H.modify_ \st -> st { input = s }

  ClickButton -> do
    old_st <- H.get
    m_respond <- H.liftAff $ AX.request $ AX.defaultRequest
      { url = "http://127.0.0.1:10037/api/file/download/" <> old_st.input
      , method = Left GET
      , responseFormat = AXRF.string -- 回傳內容用string格式解析
      , headers =
        [
          AXRH.RequestHeader "Accept" "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        ]
      }

    case m_respond of
      Right respond -> do
        H.modify_ \st -> st { message = "上傳成功" }
        st <- H.get
        H.raise (Submit st.message)
      Left errMsg -> do -- 失敗
        let message = "error: " <> printError errMsg
        H.modify_ \st -> st { message = message }
        st <- H.get
        H.raise (Error message)