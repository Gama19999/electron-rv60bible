/** Script that exposes selected properties of Electron to the Renderer proces */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    /** Retrieves the current server address and port */
    getServerAddress: () => ipcRenderer.invoke('get-server-address'),
})