const { app, BrowserWindow } = require("electron");
const path = require("path");

app.disableHardwareAcceleration(); // ✅ fix GPU crash

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      sandbox: false, // ✅ important
    },
  });

  // 👉 use Vite dev server FIRST
  // win.loadURL("http://localhost:8080");
  win.webContents.openDevTools();
  win.loadFile(path.join(__dirname, "dist/index.html"));
  // win.loadFile("dist/index.html");
}

app.whenReady().then(createWindow);