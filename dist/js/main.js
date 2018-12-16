"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let win;
//#region Window Event Handlers
function createWindow() {
    win = new electron_1.BrowserWindow({
        height: 600,
        width: 800
    });
}
electron_1.app.on("ready", () => {
    win = new electron_1.BrowserWindow({ width: 1000, height: 800 });
    win.loadFile("dist/html/index.html");
    win.webContents.openDevTools();
    win.on("closed", () => {
        win = null;
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
electron_1.app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
//#endregion
//#region IPC Event Handlers
electron_1.ipcMain.on("event-user-data", (event, arg) => {
    console.log(arg);
    event.sender.send("event-user-data-reply", "some reply here");
});
//#endregion
