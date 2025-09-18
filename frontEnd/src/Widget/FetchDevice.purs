module Widget.FetchDevice where

import Prelude
import Data.Either (Either(..))

import Data.HTTP.Method (Method(..))

import Effect.Aff.Class (class MonadAff)

import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE

import Affjax.Web as AX
import Affjax (printError)
import Affjax.ResponseFormat as AXRF
import Affjax.RequestHeader as AXRH

type Slot id = H.Slot Query Output id

data Query a
  = QueryUnit

data Output
  = Submit String

data Action
  = Initialize
  | ClickButton

type State = { message :: String }

-- component負責把所有東西組合起來
component :: forall query input m. MonadAff m => H.Component query input Output m
component = -- (初始狀態, 渲染HTML, 處理互動)
  H.mkComponent
    { initialState: const { message: "(NULL)" }
    , render
    -- EvalSpec = 
    -- { -- 主處理器
    --   handleAction :: action -> HalogenM state action slots output m Unit
    --   -- 向父或子要資料
    -- , handleQuery  :: forall a. query a -> HalogenM state action slots output m (Maybe a)
    --   -- 初始化
    -- , initialize   :: Maybe action
    --   -- 回收執行
    -- , finalize     :: Maybe action
    --   -- 來自父層的更新
    -- , receive      :: input -> Maybe action
    -- }
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

-- HTML元件
-- element(如div,p...) :: [HH.PropertyOrHandler i] -> [HH.HTML w i] -> HH.HTML w i
-- element(如div,p...) :: [<屬性/事件>] -> [element@<子元素>] -> element
-- 有的element不能有[<子元素>] 如input
-- 如果不需要[<屬性/事件>] 可以使用帶下底線的函式版本 如div_ p_

-- HH.PropertyOrHandler i :: IProp r i
-- placeholder和onInput都算是<屬性/事件>@IProp的一種建構子
-- HP.placeholder@<加入屬性:提示文字> :: IProp (placeholder :: String | r) i
-- HE.onInput@<加入事件: 即時觸發> :: IProp (onInput :: Event -> Action | r) i
-- r是原有的屬性 也就是子元素傳上來的(placeholder, onInput, value,  ...)
-- i是所有事件可能回傳的Action型別
-- IProp r i :: IProp (HH.PropertyOrHandler r i)

-- render 構建HTML
-- 每次有state改變就會呼叫render render是純函數
-- H.ComponentHTML :: H.ComponentHTML Action Input m
-- render只接受state 所以Input固定是()
render :: forall m. State -> H.ComponentHTML Action () m
render state = 
  HH.div_
    [ HH.button
      [ HE.onClick \_ -> ClickButton ]
      [ HH.text "取得我的裝置" ]
    , HH.p_ [ HH.text state.message ]
    ]

-- handleAction :: Action -> H.HalogenM State Action Slots output m Unit
-- Action 動作 也就是handleAction裡面的每個case 可以是內部事件或子元件的訊息
-- Slots 放子元件的API //若無可填()或是塞Unit
-- Output 給父物件的資料型別 //若無可像m一樣寫forall output => -> output
-- m 父元件所在的 monad
--    正常選Effect(同步副作用) 測試選Aff(非同步副作用) 也可以自寫 通常用類型限制例如MonadAff m
--    只要有liftAff 就要加入支援Aff(MonadAff m) Effect則不用 因為MonadAff繼承了MonadEffect
-- Unit 回傳值 handleAction不需回傳值
-- 所有副作用都要在HalogenM做 理論上handleAction會統一包含所有的副作用
handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action () Output m Unit
handleAction action = case action of
  Initialize -> pure unit -- pure unit 意思是什麼都不做

  ClickButton -> do
    -- 執行 AJAX GET 請求  回傳一個HTTP回應 回傳值型別為Aff(Either Error Respond)
    -- AX.request 發送GET  參數是一個做好的Request record
    -- type Request a {
    --     content :: Maybe RequestBody
    --   , headers :: Array RequestHeader
    --   , method :: Either Method CustomMethod
    --   , password :: Maybe String
    --   , responseFormat :: ResponseFormat a
    --   , timeout :: Maybe Milliseconds
    --   , url :: URL
    --   , username :: Maybe String
    --   , withCredentials :: Boolean
    -- }
    -- responseFormat為回傳值的解析方式 所以a也就是回傳值的型別
    -- defaultRequest是可以只傳部分參數的建構子 剩下用預設值 可以快速產生Request
    -- request回傳值是Aff (Either Error (Response a))
    -- halogen只接受HalogenM這種副作用 所以要用liftAff把Aff包進HalogenM
    m_respond <- H.liftAff $ AX.request $ AX.defaultRequest
      { url = "http://127.0.0.1:10037/api/os"
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

    -- Respond(status :: Int , body :: a , headers :: Headers)
    -- 本例中 responseFormat上面給了AXRF.string 所以body要當成字串解析
    case m_respond of
      -- modify 更新狀態 return新狀態
      -- modify_ 更新狀態 不return
      -- get return整個state
      -- gets 讀取state並套用函式 通常用於取state的某個成員
      Right respond -> H.modify_ \st -> st { message = respond.body } -- 成功 -> 更新瀏覽器的message
      Left err -> H.modify_ \st -> st { message = "error: " <> printError err } -- 失敗

    st <- H.get
    H.raise (Submit st.message)
