const { ipcRenderer } = require('electron');

window.electronAPI = {
    openDevTools: () => {
        ipcRenderer.send('open-dev-tools');
    }
};