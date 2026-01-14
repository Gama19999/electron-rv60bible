const { app } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const path = require('node:path')
const logger = require('./logger')

const production = path.join(app.getPath('userData'), 'databases')
const development = path.join(app.getAppPath(), 'databases')
const databasesPath = app.isPackaged ? production : development

const rv60 = new sqlite3.Database(path.join(databasesPath, 'xml-rv60.db'), logError)
const rvc = new sqlite3.Database(path.join(databasesPath, 'xml-rvc.db'), logError)
const nvi = new sqlite3.Database(path.join(databasesPath, 'xml-nvi.db'), logError)
const lbla = new sqlite3.Database(path.join(databasesPath, 'xml-lbla.db'), logError)

function logError(err) {
    if (err) logger.error('(dblink)\n', err)
}

function checkVersionId(versionId) {
    if (!bibles[versionId]) {
        logger.warn(`versionId: (${versionId}) not found`)
        throw new Error('Not found', { cause: `versionId (${versionId}) not found`, status: 404 })
    }
}

function checkType(arg, type) {
    switch (type) {
        case 'id':
            if (!Number.isFinite(+arg)) {
                logger.warn(`id (${arg}) value invalid`)
                throw new Error('Invalid argument', { cause: `id (${arg}) value invalid`, status: 422 })
            } else break
        case 'flag':
            if (!Number.isFinite(+arg)) {
                if (+arg === 0 || +arg === 1) return
                logger.warn(`flag (${arg}) value invalid`)
                throw new Error('Invalid argument', { cause: `flag (${arg}) value invalid`, status: 422 })
            } else break
        case 'color':
            if (!colors[arg]) {
                logger.warn(`color (${arg}) value invalid`)
                throw new Error('Invalid argument', { cause: `color (${arg}) value invalid`, status: 422 })
            } else break
    }
}

function checkVerseIntegity(verseBody) {
    const { verseId, bookId, chapterId, verseOrdinal, isFavourite, color } = verseBody
    checkType(verseId, 'id')
    checkType(bookId, 'id')
    checkType(chapterId, 'id')
    checkType(verseOrdinal, 'id')
    checkType(isFavourite, 'flag')
    checkType(color, 'color')
}

const bibles = {
    'rv60': rv60,
    'rvc': rvc,
    'nvi': nvi,
    'lbla': lbla,
}

const queries = {
    books: 'SELECT book_id AS bookId, book_name AS name, book_abr AS abr, chapter_count AS chapterCount, book_testament AS testament, book_order_in_testament AS bookOrdinal, book_author AS author, book_written_year AS date FROM books',
    getBook: 'SELECT book_id AS bookId, book_name AS name, book_abr AS abr, chapter_count AS chapterCount, book_testament AS testament, book_order_in_testament AS bookOrdinal, book_author AS author, book_written_year AS date FROM books where book_id = ?',
    verses: 'SELECT verse_id AS verseId, book_id AS bookId, chapter_id AS chapterId, verse_ordinal AS verseOrdinal, verse_text AS text, marked_favourite AS isFavourite, colored_as AS color FROM verses WHERE book_id = ? AND chapter_id = ?',
    getFavourites: 'SELECT v.verse_id AS verseId, v.book_id AS bookId, v.chapter_id AS chapterId, v.verse_ordinal AS verseOrdinal, v.verse_text AS text, v.marked_favourite AS isFavourite, v.colored_as AS color, b.book_name AS bookName FROM verses AS v, books AS b WHERE v.colored_as NOT LIKE "normal" AND v.book_id = b.book_id',
    setFavourite: 'UPDATE verses SET marked_favourite = ?, colored_as = ? WHERE verse_id = ? AND book_id = ? AND chapter_id = ? AND verse_ordinal = ?',
    setColors: 'UPDATE verses SET colored_as = ? WHERE verse_id = ? AND book_id = ? AND chapter_id = ? AND verse_ordinal = ?',
}

const colors = {
    normal: 'normal',
    favourite: 'favourite',
    color1: 'color1',
    color2: 'color2',
    color3: 'color3',
    color4: 'color4',
}

const versions = [
    { id: 'rv60', lang: 'es', name: 'Reina Valera 1960' },
    { id: 'rvc', lang: 'es', name: 'Reina Valera Contemporánea' },
    { id: 'nvi', lang: 'es', name: 'Nueva Versión Internacional' },
    { id: 'lbla', lang: 'es', name: 'Biblia de las Ámericas' }
]

const dblink = {
    versions: () => {
        return versions.slice()
    },
    getVersion: (versionId) => {
        checkVersionId(versionId)
        return versions.find(ver => ver.id === versionId)
    },
    books: async (versionId) => {
        checkVersionId(versionId)
        return new Promise((resolve, reject) => {
            const result = {}
            bibles[versionId].all(queries.books, (err, rows) => {
                if (err) {
                    logError(err)
                    result.status = 500
                    result.message = err.message
                    reject(result)
                } else {
                    result.status = 200
                    result.content = rows
                    resolve(result)
                }
            })
        })
    },
    getBook: async (versionId, bookId) => {
        checkVersionId(versionId)
        checkType(bookId, 'id')
        return new Promise((resolve, reject) => {
            const result = {}
            const stmt = bibles[versionId].prepare(queries.getBook, logError)
                .bind([bookId], logError)
                .get((err, row) => {
                    if (err) {
                        logError(err)
                        result.status = 500
                        result.message = err.message
                        reject(result)
                    } else {
                        result.status = 200
                        result.content = row
                        resolve(result)
                    }
                })
            stmt.finalize()
        })
    },
    verses: async (versionId, bookId, chapterId) => {
        checkVersionId(versionId)
        checkType(bookId, 'id')
        checkType(chapterId, 'id')
        return new Promise((resolve, reject) => {
            const result = {}
            const stmt = bibles[versionId].prepare(queries.verses, logError)
                .bind([bookId, chapterId], logError)
                .all((err, rows) => {
                    if (err) {
                        logError(err)
                        result.status = 500
                        result.message = err.message
                        reject(result)
                    } else {
                        result.status = 200
                        result.content = rows
                        resolve(result)
                    }
                })
            stmt.finalize()
        })
    },
    getFavourites: async (versionId) => {
        checkVersionId(versionId)
        return new Promise((resolve, reject) => {
            const result = {}
            bibles[versionId].all(queries.getFavourites, (err, rows) => {
                if (err) {
                    logError(err)
                    result.status = 500
                    result.message = err.message
                    reject(result)
                } else {
                    const content = {}
                    result.status = 200
                    result.content = rows
                    resolve(result)
                }
            })
        })
    },
    setFavourite: async (versionId, verseBody) => {
        checkVersionId(versionId)
        checkVerseIntegity(verseBody)
        verseBody.color = verseBody.isFavourite === 1 ? 'favourite' : 'normal'
        return new Promise((resolve, reject) => {
            const result = {}
            const { verseId, bookId, chapterId, verseOrdinal, isFavourite, color } = verseBody
            const stmt = bibles[versionId].prepare(queries.setFavourite, logError)
                .bind([isFavourite, color, verseId, bookId, chapterId, verseOrdinal], logError)
                .run(function (err) {
                    if (err) {
                        logError(err)
                        result.status = 500
                        result.message = err.message
                        reject(result)
                    } else {
                        result.status = 200
                        result.content = { msg: `Verse ${verseId} ${isFavourite ? 'set' : 'unset'} as favourite.`, changes: this.changes }
                        resolve(result)
                    }
                })
            stmt.finalize()
        })
    },
    setColors: async (versionId, verseBody) => {
        checkVersionId(versionId)
        checkVerseIntegity(verseBody)
        if (verseBody.isFavourite) {
            logger.warn(`Verse ${verseBody.verseId} is a favourite. Cannot change highlight color.`)
            throw new Error('Invalid argument', { cause: `Verse ${verseBody.verseId} is a favourite. Cannot change highlight color.`, status: 422 })
        }
        return new Promise((resolve, reject) => {
            const result = {}
            const { verseId, bookId, chapterId, verseOrdinal, color } = verseBody
            const stmt = bibles[versionId].prepare(queries.setColors, logError)
                .bind([color, verseId, bookId, chapterId, verseOrdinal], logError)
                .run(function (err) {
                    if (err) {
                        logError(err)
                        result.status = 500
                        result.message = err.message
                        reject(result)
                    } else {
                        result.status = 200
                        result.content = { msg: `Verse ${verseId} colors updated`, changes: this.changes }
                        resolve(result)
                    }
                })
            stmt.finalize()
        })
    },
    closeAll: () => {
        Object.values(bibles).forEach(db => db.close())
    },
}

module.exports = {
    dblink,
    bibles
};