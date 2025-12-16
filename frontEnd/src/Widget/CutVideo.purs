module Widget.CutVideo where

import Prelude
import Data.Either (Either(..))
import Data.Int (fromString, round, toNumber, floor)
import Data.Array (index, range, zip, (:), foldl, replicate)
import Data.Traversable (traverse)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple (Tuple(..))
import Data.String (length, take, replaceAll, Pattern(..), Replacement(..))
import Effect.Console (log)
import Effect (Effect)
import Effect.Class (liftEffect)

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
import Affjax.RequestBody as AXRB
import Effect.Console (log, logShow)

import MyLibrary.Http.JSON (ApiResponse(..), ResultResponse(..), WCV_MC_Result(..), WCV_CCC_Result(..))
import MyLibrary.FileSystem.FileSystem as MyFs
import Data.Argonaut.Decode (JsonDecodeError, decodeJson)
import Data.Argonaut.Core as JSON
import Affjax.RequestBody (json)

import FFI.Electron.Dialogs (openFile)
import FFI.JS.FileSystem (readDir)

data Radio = Radio Boolean String Boolean String

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
  | ClickButton_AlignRight
  | ClickTime String String
  | ClickButton_checkbox_op
  | ClickButton_checkbox_ed
  | ClickButton_CutCutCut

type State m = 
  { message :: String
  , filePaths :: Array String
  , fps :: String
  , scale :: String
  , tempDirPath :: String
  , timeline :: Array String
  , imgRender :: HH.HTML (H.ComponentSlot () m Action) Action
  , isAlignRight :: Boolean
  , isOpTimeEnable :: Boolean
  , opTime :: String
  , isEdTimeEnable :: Boolean
  , edTime :: String
  , isCuttingVisible :: Boolean
  , isCutComplete :: Boolean
  , cutCutCutMsg :: String
  }

initialState :: forall m. State m
initialState = 
  { message: ""
  , filePaths: []
  , fps: ""
  , scale: ""
  , tempDirPath: ""
  , timeline: []
  , imgRender: HH.div_ []
  , isAlignRight: false
  , isOpTimeEnable: true
  , opTime: "00:00.000"
  , isEdTimeEnable: false
  , edTime: "00:00.000"
  , isCuttingVisible: false
  , isCutComplete : false
  , cutCutCutMsg: ""
  }

component :: forall query input m. MonadAff m => H.Component query input Output m
component = -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState: \_ -> initialState
    , render
    , eval: H.mkEval H.defaultEval
      { handleAction = handleAction
      }  -- handleAction: 事件的主處理器
    }

render :: forall m. State m -> H.ComponentHTML Action () m
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
    , HH.label
        []
        [ HH.input
            [ HP.type_ HP.InputCheckbox
            , HP.name "checkbox-op"
            , HP.checked state.isAlignRight
            , HE.onChange \_ -> ClickButton_AlignRight
            ]
        , HH.text "對齊片尾" 
        ]
    , HH.label
        []
        [ HH.input
            [ HP.type_ HP.InputCheckbox
            , HP.name "checkbox-op"
            , HP.checked state.isOpTimeEnable
            , HE.onChange \_ -> ClickButton_checkbox_op
            ]
        , HH.text "顯示開頭"
        ]
    , HH.label
        []
        [ HH.input
          [ HP.type_ HP.InputCheckbox
          , HP.name "checkbox-ed"
          , HP.checked state.isEdTimeEnable
          , HE.onChange \_ -> ClickButton_checkbox_ed
          ]
        , HH.text "顯示片尾"
        ]
    , HH.p_ [ HH.text ("結果：" <> state.message)]
    , HH.div [ HP.style "display: flex; overflow-x: auto;" ] [ state.imgRender ]
    , HH.div
        [ HP.style (if state.isCuttingVisible then "visibility: visible;" else "visibility: hidden;")] 
        [ HH.button
          [ HE.onClick \_ -> ClickButton_CutCutCut ]
          [ HH.text "開剪" ]
        ]
    , HH.div
        [ HP.style (if state.isCutComplete then "visibility: visible;" else "visibility: hidden;")] 
        [ HH.text ("剪輯結果：" <> state.cutCutCutMsg) ]
    ]

allRows :: forall m. String -> Boolean -> Int -> Radio -> Effect (HH.HTML (H.ComponentSlot () m Action) Action)
allRows tempDirPath isAlignRight fps (Radio isOpTimeEnable opTime isEdTimeEnable edTime) = do
  H.liftEffect $ log "tempDirPath:"
  H.liftEffect $ logShow $ tempDirPath
  dirNames <- MyFs.getAllDirInDir tempDirPath
  let dirPaths = map (\x -> replaceAll (Pattern "\\") (Replacement "/") tempDirPath <> "/" <> x) dirNames
  totalFrames <- traverse MyFs.getTotalFrames dirPaths
  let
    maxFrames = foldl max 0 totalFrames -- 最長的影片的影格數
    imgRows = map (\(Tuple x y) -> imgRow maxFrames x y) (zip dirPaths totalFrames)
    timeRow = addRowLabel (radioLabel "欲刪除時間") (getTimeRow maxFrames)
    opRow = addRowLabel (radioLabel "剪開頭") (topControls maxFrames "op")
    edRow = addRowLabel (radioLabel "剪片尾") (topControls maxFrames "ed")
    htmlTable =
      HH.table
        [ HP.style "border-collapse: collapse; width: 100%;" ]
        ( [timeRow]
        <> [HH.tbody_ (if isOpTimeEnable then [opRow] else [])]
        <> [HH.tbody_ (if isEdTimeEnable then [edRow] else [])]
        <> map (\x -> HH.tbody_ [x]) imgRows
        )
  pure $ htmlTable
  where
    addRowLabel div1 labelArr = HH.tr_ $ 
      HH.td [ HP.style "vertical-align: top; padding: 5px;" ] [ div1 ]
      : map (\label -> HH.td_ [label]) labelArr

    radioLabel s =
      HH.div
        [ HP.style "white-space: nowrap;" ] -- 不自動換行
        [ HH.text s ]

    imgRow :: Int -> String -> Int -> HH.HTML (H.ComponentSlot () m Action) Action
    imgRow maxFrames dirPath totalFrames =
      HH.tr
        [ HP.style "border-bottom: 1px solid #ccc;" ]
        ( makeTd Nothing : fillerTd <> imgTd )
      -- (  [HH.div_ []]
      -- <> if isAlignRight then replicate 3 (HH.div_ []) else []
      -- <> map (pathToRender <<< numToPath) (range 1 totalFrames)
      -- )
      where
        makeTd (Just html) = HH.td [ HP.style "padding: 2px;" ] [ html ]
        makeTd Nothing = HH.td [ HP.style "padding: 2px;" ] []
        fillerTd = if isAlignRight then replicate (maxFrames - totalFrames) (makeTd Nothing) else []
        imgTd = map ((\x -> makeTd (Just x)) <<< pathToRender <<< numToPath) (range 1 totalFrames)
        pathToRender :: forall w. String -> HH.HTML w Action
        pathToRender path = HH.img
          [ HP.src path
          , HP.style "margin-right: 5px; height: 100px;"
          ]
        numToPath :: Int -> String
        numToPath num = "file://" <> dirPath <> "/" <> pad5 num <> ".jpg"

    topControls :: Int -> String -> Array (HH.HTML (H.ComponentSlot () m Action) Action)
    topControls maxFrames op_or_ed = map makeLabel (map toNumber $ range 0 (maxFrames - 1))
      where
        makeLabel index =
          HH.label_ 
            [ HH.input
                [ HP.type_ HP.InputRadio
                , HP.name ("radio-group-" <> op_or_ed) -- 所有 radio 同一組
                , HP.value (text index)
                , HP.checked (text index == if op_or_ed == "op" then opTime else edTime)
                , HE.onChange \_ -> ClickTime op_or_ed (text index)
                ]
            ]
    getTimeRow :: Int -> Array (HH.HTML (H.ComponentSlot () m Action) Action)
    getTimeRow maxFrames = map makeLabel (map toNumber $ range 0 (maxFrames - 1))
      where
        makeLabel index = HH.label_ [ HH.text (text index) ]

    text :: Number -> String
    text index = timeToString $ index / toNumber fps
    timeToString :: Number -> String
    timeToString t = pad2 minutes <> ":" <> pad2 seconds <> "." <> pad3 milliseconds
      where
        minutes = floor (t / 60.0)
        seconds = floor (t - toNumber (minutes * 60))
        milliseconds = round ((t - (toNumber $ floor t)) * 1000.0)

        pad2 n = if n < 10 then "0" <> show n else show n
        pad3 n
          | n < 10 = "00" <> show n
          | n < 100 = "0" <> show n
          | otherwise = show n

toJSONBody :: Array String -> Maybe AXRB.RequestBody
toJSONBody arr = Just $ json $ JSON.fromArray $ map JSON.fromString arr

handleAction :: forall m. MonadAff m => Action -> H.HalogenM (State m) Action () Output m Unit
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
        , message = "file1: " <> fromMaybe "" (result.filePaths `index` 0) -- 安全取index 理論上不可能空指標
        }

  ClickButton -> do
    old_st <- H.get

    if old_st.filePaths == [] then
      H.modify_ \st -> st { message = "請先選取檔案" }
    else do
      -- files <- liftEffect $ readDir "D:/coding/encoding/httpServer/multipleCutVideo/temp/20251117-165124/韓-BTS-Dynamite_165124"
      -- liftEffect $ logShow files

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
        , content = toJSONBody old_st.filePaths -- body
        }

      case m_respond of
        Right respond ->  -- 成功 -> 更新瀏覽器的
          case decodeJson respond.body :: Either JsonDecodeError ApiResponse of
            Left decodeErr -> H.modify_ \st -> st { message = st.message <> "JSON decode error: " <> show decodeErr } -- 解碼失敗
            Right (ApiResponse result) ->
              case result.success of -- respond是否成功 包含404和業務邏輯錯誤
                true ->
                  case result.result of
                    Just (APIMakeCuts (WCV_MC_Result rr)) -> do
                      let tempDirPath = rr.tempDirPath
                      -- liftEffect $ logShow rr.tempDirPath
                      st <- H.get
                      H.modify_ \st -> st 
                        { message = st.message <> "切片地址位於：" <> tempDirPath
                        , tempDirPath = tempDirPath
                        }
                      updateImgRender
                      H.modify_ \st -> st 
                        { isCuttingVisible = true
                        }
                    Just _ -> H.modify_ \st -> st { message = st.message <> "result.result type error" }
                    Nothing -> H.modify_ \st -> st { message = st.message <> "can't get tempDirPath" }
                false -> H.modify_ \st -> st { message = st.message <> "respond error: " <> result.message }
        Left err -> H.modify_ \st -> st { message = st.message <> "internet error: " <> printError err } -- 網路失敗

      st <- H.get
      H.raise (Submit st.message)

    
  ClickButton_AlignRight -> do
    st <- H.get
    H.modify_ \st -> st { isAlignRight = not st.isAlignRight }
    updateImgRender

  ClickTime op_or_ed time -> do
    st <- H.get
    case op_or_ed of
      "op" -> H.modify_ \st -> st { opTime = time }
      "ed" -> H.modify_ \st -> st { edTime = time }
      _ -> pure unit

  ClickButton_checkbox_op -> do
    st <- H.get
    H.modify_ \st -> st { isOpTimeEnable = not st.isOpTimeEnable }
    updateImgRender

  ClickButton_checkbox_ed -> do
    st <- H.get
    H.modify_ \st -> st { isEdTimeEnable = not st.isEdTimeEnable }
    updateImgRender

  ClickButton_CutCutCut -> do
    st <- H.get
    H.modify_ \st -> st { message = "上傳中..." }
    let
      arg_op = if st.isOpTimeEnable then st.opTime else ""
      arg_ed = if st.isEdTimeEnable then st.edTime else ""
    m_respond <- H.liftAff $ AX.request $ AX.defaultRequest
      { url = "http://127.0.0.1:10037/api/cut/cutCutCut/?" <> "op=" <> arg_op <> "&ed=" <> arg_ed
      , method = Left POST
      , responseFormat = AXRF.json -- 回傳內容用json格式解析
      , headers =
        [ AXRH.RequestHeader "Accept" "application/json"
        ]
      , content = toJSONBody st.filePaths -- body
      }

    case m_respond of
      Right respond ->  -- 成功 -> 更新瀏覽器的
        case decodeJson respond.body :: Either JsonDecodeError ApiResponse of
          Left decodeErr -> H.modify_ \st -> st { cutCutCutMsg = "JSON decode error: " <> show decodeErr } -- 解碼失敗
          Right (ApiResponse result) ->
            case result.result of
              Just (APICutCutCut (WCV_CCC_Result rr)) -> 
                if result.success then -- respond是否成功 包含404和業務邏輯錯誤
                  H.modify_ \st -> st { cutCutCutMsg = result.message }
                else
                  H.modify_ \st -> st { cutCutCutMsg = "respond error: " <> result.message <> "  errors: " <> rr.error }
              Just _ -> H.modify_ \st -> st { cutCutCutMsg = "result.error type error" }
              Nothing -> H.modify_ \st -> st { cutCutCutMsg = "can't get result.result" }
      Left err -> H.modify_ \st -> st { cutCutCutMsg = "internet error: " <> printError err } -- 網路失敗
    H.modify_ \st -> st 
      { isCutComplete = true
      , isCuttingVisible = false
      }

  
updateImgRender :: forall m. MonadAff m => H.HalogenM (State m) Action () Output m Unit
updateImgRender = do
  st <- H.get
  let fps = case fromString st.fps of
        Just num -> num
        _ -> 1
  let radio = Radio st.isOpTimeEnable st.opTime st.isEdTimeEnable st.edTime
  imgRender <- H.liftEffect $ allRows st.tempDirPath st.isAlignRight fps radio
  H.modify_ \st -> st { imgRender = imgRender }


checkInput :: String -> String -> Tuple String (Tuple Int Int)
checkInput fps scale = Tuple (str1 <> str2) (Tuple fps scale)
  where
    Tuple str1 fps = case fromString fps of
      Just f | f > 0 -> Tuple "" f 
      _ -> Tuple "fps輸入不合法 " 6
    Tuple str2 scale = case fromString scale of
      Just s | s > 0 -> Tuple "" s
      _ -> Tuple "scale輸入不合法 " 160

-- 前面補0到五位數
pad5 :: Int -> String 
pad5 n =
  let s = show n
      len = length s
  in take (5 - len) "00000" <> s

