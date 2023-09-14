const url = require("url");
const path = require("path");

import { app, BrowserWindow, dialog } from "electron";
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

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
function sendStatusToWindow(text: string) {
  log.info(text);
  window.webContents.send('message', text);
}
autoUpdater.on('update-available', (info: { version: any; }) => {
  sendStatusToWindow(`Update v${info.version} available.`);
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: `A new version (${info.version}) is available. Do you want to download and install now?`,
    buttons: ['Yes', 'No']
  }).then(response => {
    if (response.response === 0) { // If the user clicks "Yes"
      autoUpdater.downloadUpdate();
    }
  });
});
autoUpdater.on('error', (err: string) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj: { bytesPerSecond: string; percent: string; transferred: string; total: string; }) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded. Installing...');
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
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  app.quit();
});