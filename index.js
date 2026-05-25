import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { execFile, spawn } from "child_process";
import net from "net";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preloadPath = path.join(__dirname, "preload.cjs");
const backendPort = 7666;

let mainWindow;
let backendProcess;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  // mainWindow.webContents.openDevTools()
  console.log("preloadPath: " + preloadPath);
}

function startBackend() {
  const projectPath = __dirname;
  const backendPath = path.join(projectPath, "backEnd", "myServer");
  const frontendPath = path.join(projectPath, "frontEnd");
  const backendCommand = process.platform === "win32" ? "stack.exe" : "stack";
  let backendErrorOutput = "";

  backendProcess = spawn(backendCommand, ["run", "--", "+RTS", "-N", "-RTS"], {
    cwd: backendPath,
    env: {
      ...process.env,
      MCV_PROJECT_PATH: projectPath,
      MCV_BACKEND_PATH: backendPath,
      MCV_FRONTEND_PATH: frontendPath,
    },
  });

  backendProcess.stdout.on("data", (data) => {
    if (process.env.MCV_BACKEND_LOGS === "1") {
      console.log("[backend]", data.toString());
    }
  });

  backendProcess.stderr.on("data", (data) => {
    backendErrorOutput += data.toString();
    if (process.env.MCV_BACKEND_LOGS === "1") {
      console.error("[backend err]", data.toString());
    }
  });

  backendProcess.on("close", (code, signal) => {
    if (!isQuitting) {
      console.log("backend exited:", code, signal);
    }
    if (!isQuitting && code !== 0 && backendErrorOutput) {
      console.error("[backend err]", backendErrorOutput);
    }
  });
}

function isBackendListening(port = backendPort) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: "127.0.0.1", port }, () => {
      socket.end();
      resolve(true);
    });

    socket.setTimeout(500);
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function waitForBackend(port = backendPort, timeoutMs = 10000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isBackendListening(port)) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`backend did not start on port ${port}`);
}

function stopBackend() {
  if (!backendProcess || backendProcess.killed) return;

  if (process.platform === "win32") {
    execFile("taskkill", ["/pid", String(backendProcess.pid), "/T", "/F"], () => {});
    return;
  }

  backendProcess.kill();
}

async function ensureBackend() {
  if (await isBackendListening()) {
    console.log(`backend already listening on ${backendPort}`);
    return;
  }

  startBackend();
}

app.whenReady().then(async () => {
  await ensureBackend();

  // 等 backend 起來
  try {
    await waitForBackend();
  } catch (err) {
    console.error(err);
  }

  createWindow();

  ipcMain.handle("openFileDialog", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"],
    });

    return result;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("will-quit", () => {
  isQuitting = true;
  stopBackend();
});
