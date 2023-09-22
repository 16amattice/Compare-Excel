const url = require("url");
const path = require("path");

import { app, BrowserWindow, dialog } from "electron";
const { ipcMain } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const { spawn } = require('child_process');

let backendProcess: { kill: () => void; };

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let window: BrowserWindow | null;



const createWindow = () => {
  window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  }
  );
  window.setMenu(null);
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  window.maximize();
  window.on("closed", () => {
    window = null;
  });
};

let updater: { enabled: boolean; }
autoUpdater.autoDownload = false

autoUpdater.on('update-available', (info: { version: any; }) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: `A new version (${info.version}) is available. Do you want to download and install now?`,
    buttons: ['Yes', 'No']
  }).then(response => {
    if (response.response === 0) {
      autoUpdater.downloadUpdate();
    } else {
      updater.enabled = true
      updater = null
    }
  });
});
autoUpdater.on('download-progress', (progressObj: { bytesPerSecond: string; percent: string; transferred: string; total: string; }) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
})
autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update ready',
    message: 'The update is ready to be installed. The application will now close and the update will be installed.',
    buttons: ['OK']
  }).then(() => {
    autoUpdater.quitAndInstall();
  });
});

app.on("ready", () => {
  let APIPath
  if (app.isPackaged) {
    APIPath = path.join(process.resourcesPath, 'CompareExcelAPI', 'publish', 'CompareExcel.exe');
  } else {
    APIPath = path.join(__dirname, '..', 'CompareExcelAPI', 'publish', 'CompareExcel.exe');
    console.log('APIPath:', APIPath);
  }
  backendProcess = spawn(APIPath);
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('open-dev-tools', (event) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
      win.webContents.openDevTools();
  }
});


app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', () => {
  backendProcess.kill(); 
});