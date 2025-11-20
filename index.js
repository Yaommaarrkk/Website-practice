import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const preloadPath = path.join(__dirname, 'preload.js')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()
  console.log("preloadPath: " + preloadPath)
}

app.whenReady().then(() => {
  createWindow()

  // IPC handler 必須在 app ready 內
  ipcMain.handle('openFileDialog', async () => {
    console.log("IPC handler called")
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections']
    })
    console.log("dialog result:", result.filePaths)
    return result
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
