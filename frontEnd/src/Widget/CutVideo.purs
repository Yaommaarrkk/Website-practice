module Widget.CutVideo where

import Prelude
import Data.Either (Either(..))
import Data.Int (fromString)
import Data.Array (index)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Effect.Console (log)

import Data.HTTP.Method (Method(..))

import Effect.Aff.Class (class MonadAff)
import Promise.Aff (toAff)


import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

import Affjax.Web as AX
import Affjax (printError)
import Affjax.ResponseFormat as AXRF
import Affjax.RequestHeader as AXRH

import MyLibrary.Http.JSON (ApiResponse(..), ResultResponse(..), WCV_Result(..))
import Data.Argonaut.Decode (JsonDecodeError, decodeJson)
import Data.Argonaut.Core as JSON
import Affjax.RequestBody (json)

import Electron.Dialogs (openFile)

type Slot id = H.Slot Query Output id

data Query a
  = QueryUnit

data Output
  = Submit String

data Action
  = Initialize
  | InputChanged_fps String
  | InputChanged_scale String
  | ClickFileButton
  | ClickButton

type State = { message :: String, filePaths :: Array String, fps :: String, scale :: String, tempDirPath :: String }

initialState :: State
initialState = { message: "", filePaths: [], fps: "", scale: "", tempDirPath: "" }

component :: forall query input m. MonadAff m => H.Component query input Output m
component = -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState: \_ -> initialState
    , render
    , eval: H.mkEval H.defaultEval
      { handleAction = handleAction
      }  -- handleAction: 事件的主處理器
    }

render :: forall m. State -> H.ComponentHTML Action () m
render state = -- render呈現/繪製 構建HTML
  HH.div_
    [ HH.div [ HP.style "display: flex; gap: 10px;"]
      [ HH.button
        [ HE.onClick \_ -> ClickFileButton ]
        [ HH.text "選取檔案" ]
      , HH.p_ [ HH.text (fromMaybe "尚未選取檔案" (state.filePaths `index` 0))]
      ]
    , HH.div [ HP.style "display: flex; gap: 10px;"]
      [ HH.text "每秒的影格數："
      , HH.input
        [ HP.type_ HP.InputText
        , HP.placeholder "fps 預設6"
        , HP.value state.fps
        , HE.onValueInput \s -> InputChanged_fps s
        ]
      , HH.text "縮放大小："
      , HH.input
        [ HP.type_ HP.InputText
        , HP.placeholder "scale 預設160"
        , HP.value state.scale
        , HE.onValueInput \s -> InputChanged_scale s
        ]
      ]
    , HH.button
      [ HE.onClick \_ -> ClickButton ]
      [ HH.text "送出" ]
    , HH.p_ [ HH.text ("結果：" <> state.message)]
    ]

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action () Output m Unit
handleAction action = case action of
  Initialize -> pure unit

  InputChanged_fps s -> do
    H.modify_ \st -> st { fps = s }

  InputChanged_scale s -> do
    H.modify_ \st -> st { scale = s }

  ClickFileButton -> do
    H.liftEffect $ log "Button clicked!"
    promise <- H.liftEffect $ openFile
    result <- H.liftAff $ toAff promise
    if result.canceled then
      H.liftEffect $ log "User canceled"
    else do
      H.liftEffect $ log $ "Selected files: " <> show result.filePaths
      H.modify_ \st -> st 
        { filePaths = result.filePaths 
        , message = "file1: " <> fromMaybe "" (result.filePaths `index` 0)-- 安全取index 理論上不可能空指標
        }

  ClickButton -> do
    old_st <- H.get

    if old_st.filePaths == [] then
      H.modify_ \st -> st { message = "請先選取檔案" }
    else do
      let
        Tuple msg (Tuple fps_int scale_int) = checkInput old_st.fps old_st.scale
      H.modify_ \st -> st { message = "上傳中..." }
      m_respond <- H.liftAff $ AX.request $ AX.defaultRequest
        { url = "http://127.0.0.1:10037/api/cut/makeCuts/?" <> "fps=" <> show fps_int <> "&scale=" <> show scale_int
        , method = Left POST
        , responseFormat = AXRF.json -- 回傳內容用json格式解析
        , headers =
          [ AXRH.RequestHeader "Accept" "application/json"
          ]
        , content = Just $ json $ JSON.fromArray $ map JSON.fromString old_st.filePaths -- body
        }
      H.modify_ \st -> st { message = msg }

      case m_respond of
        Right respond ->  -- 成功 -> 更新瀏覽器的
          case decodeJson respond.body :: Either JsonDecodeError ApiResponse of
            Left decodeErr -> H.modify_ \st -> st { message = st.message <> "JSON decode error: " <> show decodeErr } -- 解碼失敗
            Right (ApiResponse result) ->
              case result.success of -- respond是否成功 包含404和業務邏輯錯誤
                true ->
                  case result.result of
                    Just (APICutVideo (WCV_Result rr)) -> 
                      let tempDirPath = rr.tempDirPath
                      in H.modify_ \st -> st { message = st.message <> "切片地址位於：" <> tempDirPath, tempDirPath = tempDirPath }
                    Just _ -> H.modify_ \st -> st { message = st.message <> "result.result type error" }
                    Nothing -> H.modify_ \st -> st { message = st.message <> "can't get tempDirPath" }
                false -> H.modify_ \st -> st { message = st.message <> "respond error: " <> result.message }
        Left err -> H.modify_ \st -> st { message = st.message <> "internet error: " <> printError err } -- 網路失敗

      st <- H.get
      H.raise (Submit st.message)
  

checkInput :: String -> String -> Tuple String (Tuple Int Int)
checkInput fps scale = Tuple (str1 <> str2) (Tuple fps scale)
  where
    Tuple str1 fps = case fromString fps of
      Just f | f > 0 -> Tuple "" f 
      _ -> Tuple "fps輸入不合法 " 6
    Tuple str2 scale = case fromString scale of
      Just s | s > 0 -> Tuple "" s
      _ -> Tuple "scale輸入不合法 " 160