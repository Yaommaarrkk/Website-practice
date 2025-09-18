module Main where

import Prelude (Unit, bind, const, map, show, unit, (<>))
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

_wfdSlot = Proxy :: Proxy "wfdSlot"
_wdiSlot = Proxy :: Proxy "wdiSlot"
_wvfSlot = Proxy :: Proxy "wvfSlot"
_wdfSlot = Proxy :: Proxy "wdfSlot"
_wufSlot = Proxy :: Proxy "wufSlot"

-- Slots 所有可能的子元件的宣告清單
-- Slot :: (Type -> Type) -> Type -> Type -> Type
-- Slot :: Query型別 -> Output型別 -> SlotID型別
-- Slot 只是型別宣告 不產生實際通道
type Slots =
  ( wfdSlot :: WFD.Slot Unit
  , wdiSlot :: WDI.Slot Int
  , wvfSlot :: WVF.Slot Unit
  , wdfSlot :: WDF.Slot Unit
  , wufSlot :: WUF.Slot Unit
  )

type State =
  { message :: String
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

initialState :: State
initialState = { message: "--", childInfo: "--", fileName: "--", fileContent: [] }

component :: forall query input m. MonadAff m => H.Component query input Output m
component = -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState: const initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }  -- handleAction: 事件的主處理器
    }

render :: forall m. MonadAff m => State -> H.ComponentHTML Action Slots m
render state =
  HH.div_
  [ HH.h2_ [ HH.text "歡迎來到首頁" ]
  , HH.div [ HP.style "display: flex; gap: 10px;"] -- flex 橫向排列
    [ HH.div
      [ HP.style "border-right: 1px solid #ccc; padding-right: 10px;" ]
      [ HH.h3_ [ HH.text "我的裝置：" ]
      , HH.slot _wfdSlot unit WFD.component unit (FetchDevice unit)
      ]
    , HH.div
      [ HP.style "border-right: 1px solid #ccc; padding-right: 10px;" ]
      [ HH.h3_ [ HH.text "重複每個字元 - 重複2次" ]
      , HH.slot _wdiSlot 0 WDI.component { multiple: 2 } (DoubleInput 0)
      ]
    , HH.div
      [ HP.style "border-right: 1px solid #ccc; padding-right: 10px;" ]
      [ HH.h3_ [ HH.text "重複每個字元 - 重複3次" ]
      , HH.slot _wdiSlot 1 WDI.component { multiple: 3 } (DoubleInput 1)
      ]
    ]
  , HH.div [ HP.style "display: flex; gap: 10px;"]
    [ HH.div
      [ HP.style "border-right: 1px solid #ccc; padding-right: 10px;" ]
      [ HH.h3_ [ HH.text "查看檔案" ]
      , HH.p_ [ HH.text ("內容：" <> state.childInfo)]
      , HH.slot _wvfSlot unit WVF.component unit ViewFile
      ]
    , HH.div
      [ HP.style "border-right: 1px solid #ccc; padding-right: 10px;" ]
      [ HH.h3_ [ HH.text "下載檔案" ]
      , HH.slot _wdfSlot unit WDF.component unit DownloadFile
      ]
    , HH.div
      [ HP.style "border-right: 1px solid #ccc; padding-right: 10px;" ]
      [ HH.h3_ [ HH.text "上傳檔案" ]
      --, HH.slot _wufSlot unit WUF.component unit UploadFile
      ]
    ]
  , HH.div_
    [ HH.h3_ [ HH.text "父級總輸出" ]
    , HH.p_ [ HH.text ("父級來自元件：" <> state.childInfo)]
    , HH.p_ [ HH.text ("父級結果：" <> state.message)]
    , HH.p_ [ HH.text ("檔名：" <> state.fileName)]
    , HH.p_
      [
        HH.text ("檔案內容：\n")
        , makeDiv state.fileContent
      ]
    ]
  ]

makeDiv :: forall w i. Array String -> HH.HTML w i
makeDiv strs = HH.div_ (map makeDiv_ strs)
  where
    makeDiv_ str = HH.p_ [ HH.text str]

splitText :: String -> Array String
splitText str = (split (Pattern "\n") str)

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action Slots Output m Unit
handleAction = case _ of
  FetchDevice slotId output ->
    case output of
      WFD.Submit msg ->
        H.modify_ \st -> st { message = msg, childInfo = "FetchDevice - " <> (show slotId) }

  DoubleInput slotId output ->
    case output of
      WDI.Submit multiple msg ->
        H.modify_ \st -> st { message = msg, childInfo = "DoubleInput(" <> show multiple <>  " times) - slotID: " <> show slotId }

  ViewFile output ->
    case output of
      WVF.Submit fileName content ->
        H.modify_ \st -> st { fileName = fileName, fileContent = splitText content }
      WVF.Error errMsg ->
        H.modify_ \st -> st { fileName = errMsg, fileContent = [] }

  DownloadFile output ->
    case output of
      WDF.Submit msg ->
        H.modify_ \st -> st { message = msg, childInfo = "DownloadFile" }
      WDF.Error errMsg ->
        H.modify_ \st -> st { message = errMsg, childInfo = "DownloadFile" }

  UploadFile output ->
    case output of
      WUF.Submit msg ->
        H.modify_ \st -> st { message = msg, childInfo = "UploadFile" }
      WUF.Error errMsg ->
        H.modify_ \st -> st { message = errMsg, childInfo = "UploadFile" }

main :: Effect Unit
main = HA.runHalogenAff do
  body <- HA.awaitBody
  runUI component unit body
