module Widget.DownloadFile where

import Prelude (Unit, bind, const, discard, pure, unit, ($), (<>))
import Data.Either (Either(..))
import Data.HTTP.Method (Method(..))
import Data.Maybe (Maybe(..))
import Data.Show (show)
import Effect.Console (log)

import Effect.Aff.Class (class MonadAff)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)

import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

import Affjax.Web as AX
import Affjax (printError)
import Affjax.ResponseFormat as AXRF
import Affjax.RequestHeader as AXRH
import Web.File.Blob as Blob
import Web.File.Url as Url
import Web.HTML as HTML
import Web.HTML.HTMLDocument as HTMLDocument
import Web.HTML.Window as HTMLWindow
import Web.HTML.HTMLElement as HTMLElement
import Web.DOM.Element as Element
import Web.DOM.Document as DDoc
import Web.DOM.Node as DNode

import MyLibrary.Http.Response as MyRp

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
    m_response <- H.liftAff $ AX.request $ AX.defaultRequest
      { url = "http://127.0.0.1:10037/api/file/download/" <> old_st.input
      , method = Left GET
      , responseFormat = AXRF.blob -- 回傳內容用"檔案"格式解析 設定body的型別
      , headers =
        [
          AXRH.RequestHeader "Accept" "application/octet-stream"
        ]
      }

    case m_response of
      Right response -> do
        let
          conDis = MyRp.parseConDis $ MyRp.parseConDisRH response.headers
          fileName = case MyRp.getFilename conDis of
              Just fn -> fn
              _ -> old_st.input -- 沒有conDis或沒有fileName就用輸入框的值
          blob = response.body

        _ <- H.liftAff $ downloadFile blob fileName
        H.modify_ \st -> st { message = fileName <> "下載成功"}
        st <- H.get
        H.raise (Submit st.message)
      Left errMsg -> do -- 失敗
        let message = "error: " <> printError errMsg
        H.modify_ \st -> st { message = message }
        st <- H.get
        H.raise (Error st.message)

-- 跳過框架，直接對全域動手加東西，一次性的，最後記得回收就好
-- 好處是不需要額外state來控制href、顯示/隱藏
-- revoke也麻煩
downloadFile :: Blob.Blob -> String -> Aff Unit
downloadFile blob filename = do
  liftEffect $ do
    log $ "Blob size: " <> show (Blob.size blob)
    log $ "Blob type: " <> show (Blob.type_ blob)
  -- blob是一段二進位資料
  -- createObjectURL：malloc(blob) 把位址回傳 位址的型別是字串如"blob:<uuid>"
  url <- liftEffect $ Url.createObjectURL blob
  liftEffect $ log $ "Blob URL: " <> url
  -- window：取得目前視窗，瀏覽器的全域物件(包含不只一個document 定時器 console等等的全域函式 瀏覽器資訊 視窗/事件)
  win <- liftEffect HTML.window
  -- document：取得目前的DOM樹的根
  htmlDoc <- liftEffect $ HTMLWindow.document win
  -- createElement：產生通用Element
  -- 通用Element包括SVG MathML HTML，只有HTML會渲染在網頁上，其他的要特殊API操作
  -- <a>是用來做跳頁(網址)的 加download屬性才會變成下載
  -- 建立時需傳入document，是因為建立時要設定元素型別(SVG/HTML)和要append的環境，避免一個element被不同的DOM append
  ele <- liftEffect $ DDoc.createElement "a" (HTMLDocument.toDocument htmlDoc)
  -- fromElement：轉型成HTMLElement 才能使用HTMLElement的click函式
  case HTMLElement.fromElement ele of
    Nothing -> pure unit -- 理論上不可能Nothing
    Just htmlEle -> liftEffect do
      -- <a href="blob:xxxx">
      Element.setAttribute "href" url ele
      -- <a download="123.txt">
      Element.setAttribute "download" filename ele
      -- body是Web.HTML.Document的函式
      log "Body.fromElement ele Just body"
      -- appendChild 把第一個節點加到第二個節點的list後面
      m_body <- liftEffect $ HTMLDocument.body htmlDoc
      case m_body of
        Nothing -> pure unit -- 理論上不可能Nothing
        Just body -> liftEffect do
          let
            node1 = Element.toNode ele
            node2 = Element.toNode (HTMLElement.toElement body)
          -- 把節點加入DOM樹中
          DNode.appendChild node1 node2
          -- 模擬按按鈕
          HTMLElement.click htmlEle
          log "Clicked the <a> element"
          DNode.removeChild node1 node2
          Url.revokeObjectURL url