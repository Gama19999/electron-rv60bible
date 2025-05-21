/** Module storing useful methods for the application */
const path = require('node:path')
const { BrowserWindow } = require('electron')

const UTIL = {
    /**
     * Concatenates the passed strings to form a path
     * @returns Constructed path as string
     */
    getPath: function() {
        let paths = [];
        for (let arg of arguments) paths.push(arg)
        return path.join(__dirname, ...paths)
    },
    /**
     * Displays Sqlite3 error information if present or a custom message otherwise
     */
    dbError: function() {
        if (arguments[0]) console.log('Sqlite3 error!\n', arguments[0])
        else if (arguments[1]) console.log(arguments[1])
    },
    /**
     * Toggles fullscreen mode
     * @param state Enabled or Disabled
     */
    setFullScreenState: function(state) {
        BrowserWindow.getAllWindows()[0].setFullScreen(state)
    },
    /**
     * Closes all opened windows
     */
    closeAllWindows: function() {
        BrowserWindow.getAllWindows().forEach(w => w.close())
    }
}

module.exports = UTIL