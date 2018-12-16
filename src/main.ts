import { app, BrowserWindow, ipcMain } from "electron";

let win: BrowserWindow;

//#region Window Event Handlers

function createWindow() {
  win = new BrowserWindow({
    height: 600,
    width: 800
  });
}

app.on("ready", () => {
  win = new BrowserWindow({ width: 1000, height: 800 });
  win.loadFile("dist/html/index.html");
  win.webContents.openDevTools();
  win.on("closed", () => {
    win = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

//#endregion

//#region IPC Event Handlers

ipcMain.on("event-user-data", (event, arg) => {
  console.log(arg);
  event.sender.send("event-user-data-reply", "some reply here");
});

//#endregion
