/** Modules to control application life and create native browser window */
const { app, BrowserWindow, ipcMain, Menu } = require('electron')

const util = require('./util')
const dblink = require('../data/dblink')

/**
 * Creates a new app window
 */
function createWindow() {
    const window = new BrowserWindow({
        width: 1200,
        height: 700,
        icon: util.getPath('..', 'www', 'media', 'icons', 'ic_color.png'),
        webPreferences: {
            preload: util.getPath('preload.js')
        }
    })

    window.maximize()
    window.loadFile(util.getPath('..', 'www', 'index.html')) // Load the index.html of the app
    window.webContents.setWindowOpenHandler((details) => { // Handler for in-app links
        require('electron').shell.openExternal(details.url) // Opens in-app links on external browser
        return {action: 'deny'}
    })

    //window.webContents.openDevTools();

    Menu.setApplicationMenu(null)
}

/** Called when Electron finishes initialization and is ready to create browser windows */
app.whenReady().then(() => {
    dblink.open()

    // Handlers
    ipcMain.on('fullscreen-state', (evt, state) => util.setFullScreenState(state))
    ipcMain.on('exit', () => util.closeAllWindows())
    ipcMain.handle('get-all-books', async () => await dblink.getAllBooks())
    ipcMain.handle('get-verses-on', async (evt, vr) => await dblink.getVersesOn(vr))

    createWindow()
})

/** Called when all windows are closed */
app.on('window-all-closed', () => {
    dblink.close()
    app.exit(0)
})