/** Modules to control application life and create native browser window */
const { app, BrowserWindow, globalShortcut, ipcMain, Menu, powerSaveBlocker, shell } = require('electron')
const fs = require('node:fs')
const path = require('node:path')
const { getServerAddress, closeServer } = require('../backend/main')
const { getDataSourceFiles } = require('../backend/databases')
const { APP_DATABASES } = require('../backend/constants')


/** Power blocker ID @type {number | undefined} */
let appBlockerId
/** App main window @type {BrowserWindow} */
let mainWindow

function setupElectron() {
    // Disables NodeJS logs
    if (app.isPackaged) { console.log = () => {} }
    // Sets App User Model ID
    if (process.platform === 'win32') { app.setAppUserModelId('app.web.serial30here.rv60bible') }
}

/** Copies data sources to userData folder if not present */
function initDatabases() {
    if (app.isPackaged) {
        const destDir = path.join(app.getPath('userData'), APP_DATABASES)
        fs.mkdirSync(destDir, { recursive: true })
        const dataSourceFiles = getDataSourceFiles()
        for (const dataSrcFile of dataSourceFiles) {
            const srcFile = path.join(app.getAppPath(), APP_DATABASES, dataSrcFile)
            const destFile = path.join(destDir, dataSrcFile)
            if (!fs.existsSync(destFile)) {
                fs.copyFileSync(srcFile, destFile)
            }
        }
    }
}

/** 
 * Requests the Electron display config
 * @param {string | undefined} like As `asleep` or `awake`
 * @returns The current display config
 */
function requestDisplaySleep(like) {
    switch (like) {
        case 'asleep': finishPowerSaverBlocker(); break
        case 'awake': startPowerSaveBlocker(); break
    }
    return powerSaveBlocker.isStarted(appBlockerId) ? 'awake' : 'asleep'
}

/** Starts a new power saver blocker */
function startPowerSaveBlocker() {
    if (powerSaveBlocker.isStarted(appBlockerId ?? 0)) return
    appBlockerId = powerSaveBlocker.start('prevent-display-sleep')
    console.log('prevent-display-sleep', `Blocker ID (${appBlockerId}) is ${powerSaveBlocker.isStarted(appBlockerId) ? 'on' : 'off'}`)
}

/** Stops the current power saver blocker */
function finishPowerSaverBlocker() {
    if (powerSaveBlocker.isStarted(appBlockerId ?? 0)) {
        powerSaveBlocker.stop(appBlockerId)
        console.log('allow-display-sleep', `Blocker ID (${appBlockerId}) is ${powerSaveBlocker.isStarted(appBlockerId) ? 'on' : 'off'}`)
    }
}

/** Registers app related keyboard shortcuts */
function registerShortcuts() {
    globalShortcut.register('Alt+Left', () => {
        if (mainWindow.webContents.navigationHistory.canGoBack())
            mainWindow.webContents.navigationHistory.goBack()
    })
    globalShortcut.register('F11', () => {
        mainWindow.setFullScreen(!mainWindow.isFullScreen())
    })
}

/** Creates main app window */
function createWindow() {
    mainWindow = new BrowserWindow({
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
    mainWindow.maximize()
    mainWindow.loadFile(path.join(app.getAppPath(), 'www', 'index.html')) // Load the index.html of the app
    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url) // Opens in-app links on external browser
        return { action: 'deny' }
    })
    mainWindow.webContents.openDevTools();
    Menu.setApplicationMenu(null)
}


app.commandLine.appendSwitch('lang', 'es-419'); // Sets language pack to Spanish (Latin America)

app.whenReady().then(() => {
    initDatabases()

    // Renderer handlers
    ipcMain.handle('get-server-address', (evt) => getServerAddress())
    ipcMain.handle('get-display-sleep', (evt, like) => requestDisplaySleep(like))

    registerShortcuts()
    startPowerSaveBlocker()
    createWindow()
})

app.on('browser-window-focus', () => registerShortcuts())

app.on('browser-window-blur', () => globalShortcut.unregisterAll())

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
    finishPowerSaverBlocker(appBlockerId)
})

app.on('window-all-closed', () => {
    closeServer()
    app.quit()
})