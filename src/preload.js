const { ipcRenderer } = require('electron');

process.once('loaded', () => {
    window.electronAPI = {
        openDevTools: () => ipcRenderer.send('open-dev-tools')
    };
});

