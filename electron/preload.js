/** Script that exposes selected properties of Electron to the Renderer proces */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    /** @returns {Promise<string>} Promises the electron server address as `http://127.0.0.1:*` */
    getServerAddress: () => ipcRenderer.invoke('get-server-address'),
    /** @param {string | undefined} like As `asleep` or `awake` — If `undefined` requests current display config @returns {Promise<boolean>} Promises current display config */
    requestDisplaySleep: (like) => ipcRenderer.invoke('get-display-sleep', like),
})