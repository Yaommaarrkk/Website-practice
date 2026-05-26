module Main where

import Prelude (Unit, bind, map, show, unit, (<>))
import Data.String.Common (split)
import Data.String.Pattern (Pattern(..))
import Halogen as H
import Halogen.Aff as HA
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.VDom.Driver (runUI)
import Effect (Effect)
import Effect.Aff.Class (class MonadAff)
import Type.Proxy (Proxy(..))
import Widget.FetchDevice as WFD
import Widget.DoubleInput as WDI
import Widget.VileFile as WVF
import Widget.DownloadFile as WDF
import Widget.UploadFile as WUF
import Widget.CutVideo as WCV

_wfdSlot = Proxy :: Proxy "wfdSlot"

_wdiSlot = Proxy :: Proxy "wdiSlot"

_wvfSlot = Proxy :: Proxy "wvfSlot"

_wdfSlot = Proxy :: Proxy "wdfSlot"

_wufSlot = Proxy :: Proxy "wufSlot"

_wcvSlot = Proxy :: Proxy "wcvSlot"

-- Slots 所有可能的子元件的宣告清單
-- Slot :: (Type -> Type) -> Type -> Type -> Type
-- Slot :: Query型別 -> Output型別 -> SlotID型別
-- Slot 只是型別宣告 不產生實際通道
type Slots
  = ( wfdSlot :: WFD.Slot Unit
    , wdiSlot :: WDI.Slot Int
    , wvfSlot :: WVF.Slot Unit
    , wdfSlot :: WDF.Slot Unit
    , wufSlot :: WUF.Slot Unit
    , wcvSlot :: WCV.Slot Unit
    )

type State
  = { message :: String
    , childInfo :: String
    , fileName :: String
    , fileContent :: Array String
    }

data Output
  = OutputUnit

data Action
  = FetchDevice Unit WFD.Output
  | DoubleInput Int WDI.Output
  | ViewFile WVF.Output
  | DownloadFile WDF.Output
  | UploadFile WUF.Output
  | CutVideo WCV.Output

initialState :: State
initialState = { message: "--", childInfo: "--", fileName: "--", fileContent: [] }

component :: forall query input m. MonadAff m => H.Component query input Output m
component =  -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState: \_ -> initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction } -- handleAction: 事件的主處理器
    }

render :: forall m. MonadAff m => State -> H.ComponentHTML Action Slots m
render state =
  HH.main
    [ HP.class_ (HH.ClassName "app-shell") ]
    [ HH.header
        [ HP.class_ (HH.ClassName "app-header") ]
        [ HH.div_
            [ HH.p
                [ HP.class_ (HH.ClassName "eyebrow") ]
                [ HH.text "Haskell + PureScript + Electron" ]
            , HH.h1_ [ HH.text "Multiple Cut Video" ]
            , HH.p
                [ HP.class_ (HH.ClassName "subtitle") ]
                [ HH.text "用桌面介面串接後端 HTTP server，完成影片抽幀、進度輪詢與多檔切片流程。" ]
            ]
        , HH.div
            [ HP.class_ (HH.ClassName "status-panel") ]
            [ HH.span [ HP.class_ (HH.ClassName "status-label") ] [ HH.text "目前元件" ]
            , HH.strong_ [ HH.text state.childInfo ]
            ]
        ]
    , HH.section
        [ HP.class_ (HH.ClassName "workflow-grid") ]
        [ HH.aside
            [ HP.class_ (HH.ClassName "workflow-rail") ]
            [ HH.h2_ [ HH.text "系統流程" ]
            , HH.ol_
                [ HH.li_ [ HH.text "Electron 啟動 Haskell backend" ]
                , HH.li_ [ HH.text "Halogen UI 選取影片與送出參數" ]
                , HH.li_ [ HH.text "後端建立 request id 並開始抽幀" ]
                , HH.li_ [ HH.text "前端輪詢進度並呈現時間軸" ]
                , HH.li_ [ HH.text "依照起訖時間送出切片請求" ]
                ]
            ]
        , HH.section
            [ HP.class_ (HH.ClassName "workspace") ]
            [ HH.div
                [ HP.class_ (HH.ClassName "section-title") ]
                [ HH.div_
                    [ HH.h2_ [ HH.text "影片切片工作台" ]
                    , HH.p_ [ HH.text "選檔、抽幀、指定切點，最後送出剪輯。" ]
                    ]
                , HH.div
                    [ HP.class_ (HH.ClassName "result-pill") ]
                    [ HH.text ("結果：" <> state.message) ]
                ]
            , HH.slot _wcvSlot unit WCV.component unit CutVideo
            ]
        ]
    ]

makeDiv :: forall w i. Array String -> HH.HTML w i
makeDiv strs = HH.div_ (map makeDiv_ strs)
  where
  makeDiv_ str = HH.p_ [ HH.text str ]

splitText :: String -> Array String
splitText str = (split (Pattern "\n") str)

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action Slots Output m Unit
handleAction = case _ of
  FetchDevice slotId output -> case output of
    WFD.Submit msg -> H.modify_ \st -> st { message = msg, childInfo = "FetchDevice - " <> (show slotId) }
  DoubleInput slotId output -> case output of
    WDI.Submit multiple msg -> H.modify_ \st -> st { message = msg, childInfo = "DoubleInput(" <> show multiple <> " times) - slotID: " <> show slotId }
  ViewFile output -> case output of
    WVF.Submit fileName content -> H.modify_ \st -> st { fileName = fileName, fileContent = splitText content }
    WVF.Error errMsg -> H.modify_ \st -> st { fileName = errMsg, fileContent = [] }
  DownloadFile output -> case output of
    WDF.Submit msg -> H.modify_ \st -> st { message = msg, childInfo = "DownloadFile" }
    WDF.Error errMsg -> H.modify_ \st -> st { message = errMsg, childInfo = "DownloadFile" }
  UploadFile output -> case output of
    WUF.Submit msg -> H.modify_ \st -> st { message = msg, childInfo = "UploadFile" }
    WUF.Error errMsg -> H.modify_ \st -> st { message = errMsg, childInfo = "UploadFile" }
  CutVideo output -> case output of
    WCV.Submit msg -> H.modify_ \st -> st { message = msg, childInfo = "CutVideo" }

main :: Effect Unit
main =
  HA.runHalogenAff do
    body <- HA.awaitBody
    runUI component unit body
