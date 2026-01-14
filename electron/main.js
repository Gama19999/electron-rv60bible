/** Modules to control application life and create native browser window */
const { app, BrowserWindow, globalShortcut, ipcMain, Menu, powerSaveBlocker, shell } = require('electron')
const path = require('node:path')
const backend = require('../backend/backend')


/** Number with the display sleep blocker ID  */
let appBlockerId
/** Backend server */
let server

/** Creates a new app window */
function createWindow() {
    const window = new BrowserWindow({
        width: 1250,
        height: 700,
        minWidth: 1250,
        minHeight: 700,
        icon: path.join(app.getAppPath(), 'www', 'assets', 'icons', 'rv60bible.png'),
        webPreferences: {
            preload: path.join(app.getAppPath(), 'electron', 'preload.js'),
            devTools: !app.isPackaged,
        }
    })
    window.maximize()
    window.loadFile(path.join(app.getAppPath(), 'www', 'index.html')) // Load the index.html of the app
    window.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url) // Opens in-app links on external browser
        return { action: 'deny' }
    })
    window.webContents.openDevTools();
    Menu.setApplicationMenu(null)
}

/**
 * Instructs the app to keep the screen always on
 * @returns Number with the blocker ID 
 */
function preventDisplaySleep() {
    appBlockerId = powerSaveBlocker.start('prevent-display-sleep')
    if (powerSaveBlocker.isStarted(appBlockerId)) console.log('preventing display sleep')
    return appBlockerId
}

/**
 * Instructs the app to restore the screen power configuration
 * @param blockerId Number with the blocker ID previously assigned
 * @returns Whether the specified powerSaveBlocker has been stopped
 */
function allowDisplaySleep() {
    if (powerSaveBlocker.isStarted(appBlockerId)) {
        console.log('allowing display sleep')
        return powerSaveBlocker.stop(appBlockerId)
    } else return false
}


app.commandLine.appendSwitch('lang', 'es-419'); // Sets language pack to Spanish (Latin America)

app.whenReady().then(() => {
    // Renderer handlers
    ipcMain.handle('get-server-address', (evt) => `http://${server.address().address}:${server.address().port}`)

    // Register shortcuts
    globalShortcut.register('Alt+Left', () => {
        if (BrowserWindow.getAllWindows()[0].webContents.navigationHistory.canGoBack())
            BrowserWindow.getAllWindows()[0].webContents.navigationHistory.goBack()
    })
    globalShortcut.register('F11', () => {
        const win = BrowserWindow.getAllWindows()[0]
        win.setFullScreen(!win.isFullScreen())
    })

    // Start server
    server = backend.start()

    createWindow()
    preventDisplaySleep()
})

app.on('will-quit', () => {
    allowDisplaySleep(appBlockerId)
    backend.stop()
})

app.on('window-all-closed', () => {
    app.quit()
})