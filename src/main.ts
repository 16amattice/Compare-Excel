const url = require("url");
const path = require("path");

import { app, BrowserWindow, dialog } from "electron";
const { autoUpdater } = require('electron-updater');

let window: BrowserWindow | null;

const createWindow = () => {
  window = new BrowserWindow({ width: 800, height: 600 });

  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );

  window.on("closed", () => {
    window = null;
  });
};

app.on("ready", () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-available", (info: { version: any; }) => {
  dialog.showMessageBox({
    type: "info",
    title: "Update available",
    message: `A new version (${info.version}) is available. Do you want to update now?`,
    buttons: ["Yes", "No"]
  }).then(response => {
    if (response.response === 0) { // If the user clicks "Yes"
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on("update-downloaded", () => {
  dialog.showMessageBox({
    type: "info",
    title: "Update ready",
    message: "The update is ready to be installed. The application will now close and the update will be installed.",
    buttons: ["OK"]
  }).then(() => {
    autoUpdater.quitAndInstall();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (window === null) {
    createWindow();
  }
});
