module Widget.CutVideo where

import Prelude
import Data.Either (Either(..))
import Data.Int (fromString, round, toNumber, floor)
import Data.Array (index, range, zip, (:), foldl, replicate, fromFoldable)
import Data.Traversable (traverse)
import Data.List (filter)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Map as Map
import Data.Tuple (Tuple(..))
import Data.String (length, take, replaceAll, Pattern(..), Replacement(..))
import Effect.Console (log)
import Effect (Effect)
import Effect.Class (liftEffect)
import Data.HTTP.Method (Method(..))
import Effect.Aff.Class (class MonadAff)
import Promise.Aff (toAff)
import Data.Bifunctor (lmap)
import Control.Monad.Except.Trans (ExceptT(..), except, runExceptT, throwError, lift)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Affjax.Web as AX
import Affjax (printError)
import Affjax.ResponseFormat as AXRF
import Affjax.RequestHeader as AXRH
import Affjax.RequestBody as AXRB
import Effect.Console (log, logShow)
import MyLibrary.CutVideo.MakeCutsType as McType
import MyLibrary.General (serverUrl)
import MyLibrary.Http.JSON (ApiResponse(..), ResultResponse(..), WCV_MC_Result(..))
import MyLibrary.FileSystem.FileSystem as MyFs
import Data.Argonaut.Decode (JsonDecodeError, decodeJson)
import Data.Argonaut.Core as JSON
import Affjax.RequestBody (json)
import FFI.Electron.Dialogs (openFile)
import FFI.JS.FileSystem (readDir)
import Widget.CutVideo.AskProgress as WAP
import Widget.CutVideo.CutCutCut as WCCC

_wcccSlot = Proxy :: Proxy "wcccSlot"

_wapSlot = Proxy :: Proxy "wapSlot"

type Slots
  = ( wcccSlot :: WCCC.Slot Unit
    , wapSlot :: WAP.Slot Unit
    )

type Slot id
  = forall query. H.Slot query Output id

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
  | AskProgress WAP.Output
  | CutCutCut WCCC.Output

data Radio
  = Radio Boolean String Boolean String

type State
  = { message :: String
    , filePaths :: Array String
    , fps :: String
    , scale :: String
    , tempDirPath :: String
    , requestID :: String
    , timeline :: Array String
    , imgRender :: forall m. HH.HTML (H.ComponentSlot Slots m Action) Action
    , isAlignRight :: Boolean
    , isOpTimeEnable :: Boolean
    , opTime :: String
    , isEdTimeEnable :: Boolean
    , edTime :: String
    , showAPslot :: Boolean
    , askProgressMsg :: String
    , ap_videoTable :: McType.JobMap
    , showCCCslot :: Boolean
    , cutcutcutMsg :: String
    }

initialState :: State
initialState =
  { message: ""
  , filePaths: []
  , fps: ""
  , scale: ""
  , tempDirPath: ""
  , requestID: ""
  , timeline: []
  , imgRender: HH.div_ []
  , isAlignRight: false
  , isOpTimeEnable: true
  , opTime: "00:00.000"
  , isEdTimeEnable: false
  , edTime: "00:00.000"
  , showAPslot: false
  , askProgressMsg: ""
  , ap_videoTable: McType.mkJobMap []
  , showCCCslot: false
  , cutcutcutMsg: ""
  }

component :: forall query input m. MonadAff m => H.Component query input Output m
component =  -- (初始狀態, 怎麼渲染畫面, 處理互動, 外部事件)
  H.mkComponent
    { initialState: \_ -> initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction } -- handleAction: 事件的主處理器
    }

render :: forall m. MonadAff m => State -> H.ComponentHTML Action Slots m
render state =  -- render呈現/繪製 構建HTML
  HH.div
    [ HP.class_ (HH.ClassName "cut-tool") ]
    [ HH.section
        [ HP.class_ (HH.ClassName "control-panel") ]
        [ HH.div
            [ HP.class_ (HH.ClassName "file-row") ]
            [ HH.button
                [ HP.class_ (HH.ClassName "primary-button")
                , HE.onClick \_ -> ClickFileButton
                ]
                [ HH.text "選擇影片" ]
            , HH.div
                [ HP.class_ (HH.ClassName "file-summary") ]
                [ HH.span_ [ HH.text "目前檔案" ]
                , HH.strong_ [ HH.text (fromMaybe "尚未選擇檔案" (state.filePaths `index` 0)) ]
                ]
            ]
        , HH.div
            [ HP.class_ (HH.ClassName "input-grid") ]
            [ HH.label_
                [ HH.span_ [ HH.text "每秒抽幀數" ]
                , HH.input
                    [ HP.type_ HP.InputText
                    , HP.placeholder "預設 6"
                    , HP.value state.fps
                    , HE.onValueInput \s -> InputChanged_fps s
                    ]
                ]
            , HH.label_
                [ HH.span_ [ HH.text "縮圖寬度" ]
                , HH.input
                    [ HP.type_ HP.InputText
                    , HP.placeholder "預設 160"
                    , HP.value state.scale
                    , HE.onValueInput \s -> InputChanged_scale s
                    ]
                ]
            ]
        , HH.div
            [ HP.class_ (HH.ClassName "option-row") ]
            [ checkbox "checkbox-align" state.isAlignRight "對齊片尾" ClickButton_AlignRight
            , checkbox "checkbox-op" state.isOpTimeEnable "顯示開頭切點" ClickButton_checkbox_op
            , checkbox "checkbox-ed" state.isEdTimeEnable "顯示片尾切點" ClickButton_checkbox_ed
            ]
        , HH.div
            [ HP.class_ (HH.ClassName "action-row") ]
            [ HH.button
                [ HP.class_ (HH.ClassName "primary-button")
                , HE.onClick \_ -> ClickButton
                ]
                [ HH.text "產生時間軸" ]
            ]
        ]
    , HH.section
        [ HP.class_ (HH.ClassName "progress-panel") ]
        [ HH.div
            [ HP.class_ (HH.ClassName "metric") ]
            [ HH.span_ [ HH.text "抽幀進度" ]
            , HH.strong_ [ HH.text state.askProgressMsg ]
            ]
        , HH.div
            [ HP.class_ (HH.ClassName "metric") ]
            [ HH.span_ [ HH.text "剪輯狀態" ]
            , HH.strong_ [ HH.text state.cutcutcutMsg ]
            ]
        , if state.showAPslot then
            HH.slot _wapSlot unit WAP.component args_ap AskProgress
          else
            HH.text ""
        ]
    , HH.section
        [ HP.class_ (HH.ClassName "timeline-panel") ]
        [ HH.div
            [ HP.class_ (HH.ClassName "section-title compact") ]
            [ HH.div_
                [ HH.h3_ [ HH.text "時間軸預覽" ]
                , HH.p_ [ HH.text "抽幀完成後，選擇開始與結束位置。" ]
                ]
            ]
        , HH.div [ HP.class_ (HH.ClassName "timeline-scroll") ] [ state.imgRender ]
        ]
    , HH.section
        [ HP.class_ (HH.ClassName "cut-panel") ]
        [ if state.message == "" then
            HH.text ""
          else
            HH.div
              [ HP.class_ (HH.ClassName "output-location") ]
              [ HH.span_ [ HH.text "輸出位置" ]
              , HH.strong_ [ HH.text state.message ]
              ]
        , if state.showCCCslot then
            HH.slot _wcccSlot unit WCCC.component args_ccc CutCutCut
          else
            HH.div [ HP.class_ (HH.ClassName "empty-state") ] [ HH.text "時間軸完成後即可開始剪輯。" ]
        ]
    ]
  where
  checkbox name checked label action =
    HH.label
      [ HP.class_ (HH.ClassName "check-option") ]
      [ HH.input
          [ HP.type_ HP.InputCheckbox
          , HP.name name
          , HP.checked checked
          , HE.onChange \_ -> action
          ]
      , HH.text label
      ]

  args_ap :: WAP.Input
  args_ap =
    { requestID: state.requestID
    , videoNames: state.filePaths
    }

  args_ccc :: WCCC.Input
  args_ccc =
    { filePaths: state.filePaths
    , isOpTimeEnable: state.isOpTimeEnable
    , opTime: state.opTime
    , isEdTimeEnable: state.isEdTimeEnable
    , edTime: state.edTime
    }

allRows :: forall m. String -> Boolean -> Int -> Radio -> McType.JobMap -> HH.HTML (H.ComponentSlot Slots m Action) Action
allRows tempDirPath isAlignRight fps (Radio isOpTimeEnable opTime isEdTimeEnable edTime) videoTable = do
  -- dirsName <- MyFs.getAllDirInDir tempDirPath -- 拿所有資料夾名稱
  -- totalFrames <- traverse MyFs.getTotalFrames dirPaths
  let
    doneJobs = fromFoldable $ filter (\job -> job.state == McType.Done) (Map.values videoTable)

    dirPaths = map (_.outputDir >>> normalizePath) doneJobs

    normalizePath path = replaceAll (Pattern "\\") (Replacement "/") path

    totalFrames = map (_.totalFrames >>> fromMaybe 0) doneJobs

    maxFrames = foldl max 0 totalFrames -- 最長的影片的影格數

    imgRows = map (\(Tuple x y) -> imgRow maxFrames x y) (zip dirPaths totalFrames)

    timeRow = addRowLabel (radioLabel "欲刪除時間") (getTimeRow maxFrames)

    opRow = addRowLabel (radioLabel "剪開頭") (topControls maxFrames "op")

    edRow = addRowLabel (radioLabel "剪片尾") (topControls maxFrames "ed")

    htmlTable =
      HH.table
        [ HP.class_ (HH.ClassName "timeline-table") ]
        ( [ timeRow ]
            <> [ HH.tbody_ (if isOpTimeEnable then [ opRow ] else []) ]
            <> [ HH.tbody_ (if isEdTimeEnable then [ edRow ] else []) ]
            <> map (\x -> HH.tbody_ [ x ]) imgRows
        )
  htmlTable
  where
  addRowLabel div1 labelArr =
    HH.tr_
      $ HH.td [ HP.style "vertical-align: top; padding: 5px;" ] [ div1 ]
      : map (\label -> HH.td_ [ label ]) labelArr

  radioLabel s =
    HH.div
      [ HP.class_ (HH.ClassName "timeline-label") ]
      [ HH.text s ]

  imgRow :: Int -> String -> Int -> HH.HTML (H.ComponentSlot Slots m Action) Action
  imgRow maxFrames dirPath totalFrames =
    HH.tr
      [ HP.class_ (HH.ClassName "timeline-video-row") ]
      (makeTd Nothing : fillerTd <> imgTd)
    -- (  [HH.div_ []]
    -- <> if isAlignRight then replicate 3 (HH.div_ []) else []
    -- <> map (pathToRender <<< numToPath) (range 1 totalFrames)
    -- )
    where
    makeTd (Just html) = HH.td [ HP.class_ (HH.ClassName "frame-cell") ] [ html ]

    makeTd Nothing = HH.td [ HP.class_ (HH.ClassName "frame-cell") ] []

    fillerTd = if isAlignRight then replicate (maxFrames - totalFrames) (makeTd Nothing) else []

    imgTd = map ((\x -> makeTd (Just x)) <<< pathToRender <<< numToPath) (range 1 totalFrames)

    pathToRender :: forall w. String -> HH.HTML w Action
    pathToRender path =
      HH.img
        [ HP.src path
        , HP.class_ (HH.ClassName "frame-image")
        ]

    numToPath :: Int -> String
    numToPath num = "file://" <> dirPath <> "/" <> pad5 num <> ".jpg"

  topControls :: Int -> String -> Array (HH.HTML (H.ComponentSlot Slots m Action) Action)
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

  getTimeRow :: Int -> Array (HH.HTML (H.ComponentSlot Slots m Action) Action)
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

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action Slots Output m Unit
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
      H.modify_ \st ->
        st
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
      H.modify_ \st -> st { askProgressMsg = "發送請求..." }
      m_respond <-
        H.liftAff $ AX.request
          $ AX.defaultRequest
              { url = serverUrl <> "/api/cut/makeCuts/?" <> "fps=" <> show fps_int <> "&scale=" <> show scale_int
              , method = Left POST
              , responseFormat = AXRF.json -- 回傳內容用json格式解析
              , headers =
                [ AXRH.RequestHeader "Accept" "application/json"
                , AXRH.RequestHeader "Content-Type" "application/json; charset=utf-8"
                ]
              , content = toJSONBody old_st.filePaths -- body
              }
      exceptT <- runExceptT (doRespond m_respond)
      case exceptT of
        Right _ -> do
          H.modify_ \st -> st { askProgressMsg = "處理中..." }
          pure unit
        Left errMsg -> do
          H.modify_ \st -> st { message = errMsg }
      pure unit
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
  AskProgress output -> do
    case output of
      WAP.Msg msg -> do
        H.modify_ \st -> st { askProgressMsg = msg }
        updateImgRender
      WAP.VideoTable videoTable -> do
        H.modify_ \st -> st { ap_videoTable = videoTable }
        updateImgRender
      WAP.Done -> do
        H.modify_ \st ->
          st
            { askProgressMsg = "切片完成"
            , showAPslot = true
            , showCCCslot = true
            }
        updateImgRender
  CutCutCut output -> do
    case output of
      WCCC.Submit WCCC.Ready -> H.modify_ \st -> st { cutcutcutMsg = "已啟動" }
      WCCC.Submit WCCC.Handling -> H.modify_ \st -> st { cutcutcutMsg = "剪輯中..." }
      WCCC.Submit WCCC.Done -> H.modify_ \st -> st { cutcutcutMsg = "剪輯完成" }
      WCCC.Submit WCCC.Done_Error -> H.modify_ \st -> st { cutcutcutMsg = "剪輯完成 出現錯誤" }

doRespond :: forall m. MonadAff m => Either AX.Error (AX.Response JSON.Json) -> ExceptT String (H.HalogenM State Action Slots Output m) Unit
doRespond e_respond = do
  -- lmap 只對Bifunctor左側的值套函式 在這裡就是將Either的左邊轉成String
  -- ExceptT :: ExceptT (m (Either e a))
  respond <-
    except
      $ lmap (\err -> "internet error: " <> printError err) e_respond -- 網路失敗
  apiResp <-
    except
      $ lmap (\e -> "JSON decode error: " <> show e) (decodeJson respond.body :: Either JsonDecodeError ApiResponse) -- 解碼失敗
  rr <- except $ getRr apiResp
  let
    WCV_MC_Result { tempDirPath, requestID } = rr
  let
    ApiResponse { message, success, result } = apiResp
  if success then do -- respond是否成功 包含404和業務邏輯錯誤
    -- liftEffect $ logShow rr.tempDirPath
    lift
      $ H.modify_ \st ->
          st
            { message = "切片地址位於：" <> tempDirPath
            , tempDirPath = tempDirPath
            , requestID = requestID
            , showAPslot = true
            }
    lift updateImgRender
  else
    throwError
      $ "message: "
      <> message
  where
  getRr :: ApiResponse -> Either String WCV_MC_Result
  getRr (ApiResponse { result }) = case result of
    Just (APIMakeCuts rr) -> Right rr
    Just _ -> Left "result type error"
    Nothing -> Left "can't get result.result"

updateImgRender :: forall m. MonadAff m => H.HalogenM State Action Slots Output m Unit
updateImgRender = do
  st <- H.get
  let
    Tuple _ (Tuple fps _) = checkInput st.fps st.scale

    radio = Radio st.isOpTimeEnable st.opTime st.isEdTimeEnable st.edTime
  H.liftEffect $ log "tempDirPath:"
  H.liftEffect $ logShow st.tempDirPath
  H.modify_ \st ->
    st
      { imgRender = allRows st.tempDirPath st.isAlignRight fps radio st.ap_videoTable
      }

checkInput :: String -> String -> Tuple String (Tuple Int Int)
checkInput fps scale = Tuple (str1 <> str2) (Tuple fps scale)
  where
  Tuple str1 fps = case fromString fps of
    Just f
      | f > 0 -> Tuple "" f
    _ -> Tuple "fps輸入不合法 " 6

  Tuple str2 scale = case fromString scale of
    Just s
      | s > 0 -> Tuple "" s
    _ -> Tuple "scale輸入不合法 " 160

-- 前面補0到五位數
pad5 :: Int -> String
pad5 n =
  let
    s = show n

    len = length s
  in
    take (5 - len) "00000" <> s
