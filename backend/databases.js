const { app } = require('electron')
const betterSqlite = require('better-sqlite3')
const Database = require('better-sqlite3')
const path = require('node:path')
const { APP_DATABASES, APP_USAGE, APP_FEEDBACK, SQLITE_TIMEOUT, VERSION_LIST } = require('./constants')

/** @type {{[k: string]: DBEntity}} */
const DB_ENTITIES = {
    DATABASES: { path: 'databases/', id: '' },
    VERSION_LIST: { path: '_version-list.db', id: VERSION_LIST },
    APP_USAGE: { path: '_app-usage.db', id: APP_USAGE },
    APP_FEEDBACK: { path: '_app-feedback.db', id: APP_FEEDBACK },
    ESV: { path: 'en-esv.db', id: 'esv' },
    NIV: { path: 'en-niv.db', id: 'niv' },
    NKJV: { path: 'en-nkjv.db', id: 'nkjv' },
    LBLA: { path: 'es-lbla.db', id: 'lbla' },
    NVI: { path: 'es-nvi.db', id: 'nvi' },
    PDT: { path: 'es-pdt.db', id: 'pdt' },
    RV20: { path: 'es-rv20.db', id: 'rv20' },
    RV60: { path: 'es-rv60.db', id: 'rv60' },
    RVC: { path: 'es-rvc.db', id: 'rvc' },
}

/** 
 * @param {string} file App database file name
 * @returns {string} App database file path
 */
function getDatabasePath(file) {
    const prod = path.join(app.getPath('userData'), APP_DATABASES)
    const dev = path.join(app.getAppPath(), APP_DATABASES)
    const databasesDir = app.isPackaged ? prod : dev
    return path.join(databasesDir, file) // Environment => Electron
}

/**
 * @param {string} id Requested app database ID
 * @returns {DBEntity | undefined} App database entity matching `id` 
 */
function getDatabase(id) {
    let item
    for (const dbEntity of Object.values(DB_ENTITIES)) {
        if (dbEntity.id === id) {
            if (!dbEntity.db) {
                const fileName = getDatabasePath(dbEntity.path)
                const readonly = !(dbEntity.id === APP_USAGE || dbEntity.id === APP_FEEDBACK)
                const dbOptions = {
                    readonly: readonly,
                    timeout: SQLITE_TIMEOUT,
                    verbose: console.log
                }
                dbEntity.db ||= new Database(fileName, dbOptions) // Opens SQLite database once
                if (!readonly) {
                    dbEntity.db.pragma('journal_mode = WAL') // Enables concurrent reading and writing
                }
            }
            item = dbEntity
        }
    }
    return item
}

/**
 * @returns {string[]} Array filled with the data source file names
 */
function getDataSourceFiles() {
    return Object.values(DB_ENTITIES).filter(i => i.path.includes('.db')).map(i => i.path)
}

/**
 * @typedef {Object} DBEntity
 * @property {string} path Database file name
 * @property {string} id App database ID
 * @property {betterSqlite.Database} db Better SQLite database instance
 */

module.exports = {
    getDatabase,
    getDataSourceFiles,
}