const { app } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const path = require('node:path')
const logger = require('./logger')

const production = path.join(app.getPath('userData'), 'databases')
const development = path.join(app.getAppPath(), 'databases')
const databasesPath = app.isPackaged ? production : development

const tip_err = new sqlite3.Database(path.join(databasesPath, 'tips-and-errors.db'), logError)

function logError(err) {
    if (err) logger.error('(tips-and-errors)\n', err)
}

function checkTypeId(arg) {
    if (!Number.isFinite(+arg)) {
        logger.warn(`id (${arg}) value invalid`)
        throw new Error('Invalid argument', { cause: `id (${arg}) value invalid`, status: 422 })
    }
}

function checkVersionId(versionId) {
    if (!bibles.includes(versionId)) {
        logger.warn(`versionId: (${versionId}) not found`)
        throw new Error('Not found', { cause: `versionId (${versionId}) not found`, status: 404 })
    }
}

const bibles = ['rv60', 'rvc', 'nvi', 'lbla']

const queries = {
    addVerseError: 'INSERT INTO verse_errors (version_id, verse_id, verse_content, error_type_id) VALUES (?, ?, ?, ?)',
    addAppError: 'INSERT INTO app_errors (error_type_id, extra_msg) VALUES (?, ?)',
}

const tipsAndErrors = {
    setError: async (clientReport) => {
        checkTypeId(clientReport.errorTypeId)
        return new Promise((resolve, reject) => {
            const result = {}
            let stmt = tip_err.prepare(clientReport.errorTypeId <= 3 ? queries.addVerseError : queries.addAppError, logError)
            if (clientReport.errorTypeId <= 3) {
                checkVersionId(clientReport.versionId)
                checkTypeId(clientReport.verseId)
                stmt = stmt.bind([clientReport.versionId, clientReport.verseId, clientReport.verseContent, clientReport.errorTypeId], logError)
            } else {
                stmt = stmt.bind([clientReport.errorTypeId, clientReport.extraMsg], logError)
            }
            stmt.run(function (err) {
                if (err) {
                    logError(err)
                    result.status = 500
                    result.message = err.message
                    reject(result)
                } else {
                    result.status = 201
                    result.content = { msg: 'Client report created', id: this.lastID }
                    resolve(result)
                }

            })
            stmt.finalize()
        })
    },
    closeAll: () => {
       tip_err.close()
    },
}

module.exports = tipsAndErrors;