const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backendProcess;

function resolveBackendCommand() {
  if (app.isPackaged) {
    return {
      command: path.join(process.resourcesPath, "backend", "pse-image-backend.exe"),
      args: [],
      cwd: path.join(process.resourcesPath, "backend"),
    };
  }

  const backendDir = path.resolve(__dirname, "..", "..", "backend");

  return {
    command: "python",
    args: [path.join(backendDir, "main.py")],
    cwd: backendDir,
  };
}

function startBackend() {
  const { command, args, cwd } = resolveBackendCommand();

  backendProcess = spawn(command, args, {
    cwd,
    shell: false,
    stdio: "ignore",
    windowsHide: true,
  });

  backendProcess.on("error", (error) => {
    console.error("Falha ao iniciar o backend:", error);
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    window.loadFile(path.join(__dirname, "..", "dist", "index.html"));
    return;
  }

  window.loadURL("http://localhost:5173");
}

function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", stopBackend);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
