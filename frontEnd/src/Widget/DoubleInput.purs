module Widget.DoubleInput where

import Prelude
import Data.Either (Either(..))

import Data.HTTP.Method (Method(..))

import Effect.Aff.Class (class MonadAff)

import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

import Affjax.Web as AX
import Affjax (printError)
import Affjax.ResponseFormat as AXRF
import Affjax.RequestHeader as AXRH

type Slot id = H.Slot Query Output id

data Query a
  = QueryUnit

type Input = { multiple :: Int }

data Output
  = Submit Int String

data Action
  = Initialize
  | InputChanged String
  | ClickButton

type State = { input :: String, message :: String, multiple :: Int }

defaultState :: State
defaultState = { input: "", message: "", multiple: -1 }

component :: forall query m. MonadAff m => H.Component query Input Output m
component = -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval
      { handleAction = handleAction
      }  -- handleAction: 事件的主處理器
    }
  where
    initialState :: Input -> State
    initialState input = defaultState { multiple = input.multiple }

render :: forall m. State -> H.ComponentHTML Action () m
render state = -- render呈現/繪製 構建HTML
  HH.div_
    [ HH.input
      [ HP.value state.input
      , HE.onValueInput \s -> InputChanged s
      ]
    , HH.button
      [ HE.onClick \_ -> ClickButton ]
      [ HH.text "取得兩倍字串" ]
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
      { url = "http://127.0.0.1:10037/api/echo/" <> show old_st.multiple <> "/" <> old_st.input
      , method = Left GET
      , responseFormat = AXRF.string -- 回傳內容用string格式解析
      , headers =
        [ -- Accept 告訴後端我想要什麼類型的回應 可以多個排優先級
          -- 但後端也可能亂回 通常還需看respond的Content-Type 所以responseFormat通常要設string
          AXRH.RequestHeader "Accept" "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
          -- User-Agent 通常系統自動給 除非測試時手動填
        -- , AXRH.RequestHeader "User-Agent" "Mozilla/5.0 (Linux; Android 14) MyCustomBot/1.0"
        ]
      }

    case m_respond of
      Right respond -> do
        H.modify_ \st -> st { message = respond.body }
        st <- H.get
        H.raise (Submit st.multiple respond.body)
      Left err -> do -- 失敗
        let message = "error: " <> printError err
        H.modify_ \st -> old_st { message = message }
        st <- H.get
        H.raise (Submit st.multiple message)
  