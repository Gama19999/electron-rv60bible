const { COLORS, APP_USAGE, VERSION_LIST, APP_FEEDBACK, FAVOURITE_ADDED_EN, FAVOURITE_ADDED_ES, FAVOURITE_REMOVED_EN, FAVOURITE_REMOVED_ES, NO_CHANGES_EN, NO_CHANGES_ES, FAVOURITE_RECOLORED_EN, FAVOURITE_RECOLORED_ES, FAVOURITE_COLORED_EN, FAVOURITE_COLORED_ES, BY_QUOTE, MIN_TEXT_LEN, ADDED_REPORT_EN, ADDED_REPORT_ES, DEFRAGMENT_EN, BibleData, BookData, VerseData, FavProperties, FavouriteData, InsertResp, UpdateResp, LookupValue, LookupResp, ClientReport } = require('./constants')
const { getDatabase } = require('./databases')
const { DataOperationEx } = require('./exceptions')
const { isEnglish, replace, splitBookName } = require('./util')

/** App operation queries */
const QUERIES = {
    versions: 'SELECT version_key AS versionKey, version_lang AS lang, display_name AS name, revision_year AS year FROM versions',
    /** @param {string} version_key Bible KEY */
    getVersion: 'SELECT version_key AS versionKey, version_lang AS lang, display_name AS name, revision_year AS year FROM versions WHERE version_key = ?',
    books: 'SELECT book_id AS bookId, book_name AS name, book_abr AS abr, chapter_count AS chapterCount, book_of_nt AS bookOfNT, book_order_in_testament AS bookOrdinal, book_author AS author, book_written_year AS date FROM books',
    /** @param {number} book_id Book ID */
    getBook: 'SELECT book_id AS bookId, book_name AS name, book_abr AS abr, chapter_count AS chapterCount, book_of_nt AS bookOfNT, book_order_in_testament AS bookOrdinal, book_author AS author, book_written_year AS date FROM books where book_id = ?',
    /** @param {number} book_id Book ID @param {number} chapter_id Book's chapter ID */
    verses: 'SELECT verse_id AS verseId, book_id AS bookId, chapter_id AS chapterId, verse_ordinal AS verseOrdinal, verse_text AS text FROM verses WHERE book_id = ? AND chapter_id = ?',
    /** Retrieves favourite properties of specific verse @param {string} version_key Bible KEY @param {number} verse_id Verse ID */
    getFavProperties: `SELECT favourite_id AS favouriteId, marked_favourite AS isFavourite, colored_as AS color FROM favourites WHERE version_key = ? AND verse_id = ?`,
    /** Retrieves all marked verses @param {string} version_key Bible KEY */
    favourites: `SELECT favourite_id AS favouriteId, book_id AS bookId, verse_id AS verseId, marked_favourite AS isFavourite, colored_as AS color, marked_at AS date FROM favourites WHERE version_key = ?`,    
    /** @param {number} verse_id Verse ID */
    getVerse: 'SELECT verse_id AS verseId, book_id AS bookId, chapter_id AS chapterId, verse_ordinal AS verseOrdinal, verse_text AS text FROM verses WHERE verse_id = ?',
    /** @param {string} version_key Bible KEY @param {number} book_id Book ID @param {number} verse_id Verse ID @param {number} marked_favourite `1` or `0` @param {string} colored_as `normal`, `favourite` or `color1,2,3,4` */
    addFavourite: 'INSERT INTO favourites (version_key, book_id, verse_id, marked_favourite, colored_as) VALUES (?, ?, ?, ?, ?)',
    /** @param {number} favourite_id Favourite ID  */
    removeFavourite: 'DELETE FROM favourites WHERE favourite_id = ?',
    /** @param {string} colored_as `normal`, `favourite` or `color1,2,3,4` @param {number} marked_favourite `1` or `0` @param {number} favourite_id Favourite ID */
    updateColor: 'UPDATE favourites SET colored_as = ?, marked_favourite = ? WHERE favourite_id = ?',
    /** @param {string} book_name_for_search Book name fragment enclosed by percent symbols (ex. `%fragment%`) */
    resultOfBooks: 'SELECT book_id AS bookId, book_name AS bookName FROM books WHERE book_name_for_search LIKE ?',
    /** @param {string} book_name_for_search Book name fragment enclosed by percent symbols (ex. `%fragment%`) @param {number} chapter_id Book's chapter ID */
    resultOfVerses: 'SELECT b.book_id AS bookId, b.book_name AS bookName, v.verse_id AS verseId, v.chapter_id AS chapterId, v.verse_ordinal AS verseOrdinal, v.verse_text AS text FROM books AS b, verses AS v WHERE b.book_id = v.book_id AND b.book_name_for_search LIKE ? AND v.chapter_id = ?',
    /** @param {string} verse_text_for_search Value to search for in whole bible enclosed by percent symbols (ex. `%keywords%`). Must be `4+` characters long */
    resultOfText: 'SELECT b.book_id AS bookId, b.book_name AS bookName, v.verse_id AS verseId, v.chapter_id AS chapterId, v.verse_ordinal AS verseOrdinal, v.verse_text AS text FROM books AS b, verses AS v WHERE b.book_id = v.book_id AND v.verse_text_for_search LIKE ?',
    /** @param {string} app_version Client app version @param {number} version_key Bible KEY @param {number} type_id `1,2,3,4,5` @param {number} verse_id Verse ID (`nullable`) @param {string} feedback App feedback or Verse text (`nullable`) */
    addReport: 'INSERT INTO reports (app_version, version_key, type_id, verse_id, feedback) VALUES (?, ?, ?, ?, ?)',
}

/** Wrapper for all database operations this app handles */
const DATA_OPERATIONS = {
    /** @returns {BibleData[]} Data of all bible versions */
    versions: () => {
        const versionListDB = getDatabase(VERSION_LIST)
        return versionListDB.db.prepare(QUERIES.versions).all()
    },
    /** 
     * @param {string} versionKey Bible KEY
     * @returns {BibleData | undefined} Data of the requested bible version
     */
    getVersion: (versionKey) => {
        const versionListDB = getDatabase(VERSION_LIST)
        return versionListDB.db.prepare(QUERIES.getVersion).get(versionKey)
    },
    /** 
     * @param {string} versionKey Bible KEY 
     * @returns {BookData[]} Data of all books in certain bible version
     */
    books: (versionKey) => {
        const bibleDB = getDatabase(versionKey)
        if (!bibleDB) { throw new DataOperationEx('Unknown versionKey', []) }
        return bibleDB.db.prepare(QUERIES.books).all()
    },
    /**
     * @param {string} versionKey Bible KEY
     * @param {number} bookId Book ID
     * @returns {BookData | undefined} Data of the requested book in certain bible version
     */
    getBook: (versionKey, bookId) => {
        const bibleDB = getDatabase(versionKey)
        if (!bibleDB) { throw new DataOperationEx('Unknown versionKey') }
        return bibleDB.db.prepare(QUERIES.getBook).get(+bookId)
    },
    /**
     * @param {string} versionKey Bible KEY
     * @param {number} bookId Book ID
     * @param {number} chapterId Book's chapter ID
     * @returns {VerseData[]} Data of all verses in a book's chapter of certain bible version
     */
    verses: (versionKey, bookId, chapterId) => {
        const bibleDB = getDatabase(versionKey)
        if (!bibleDB) { throw new DataOperationEx('Unknown versionKey', []) }
        /** @type {VerseData[]} */ 
        const verses = bibleDB.db.prepare(QUERIES.verses).all(+bookId, +chapterId)
        verses.forEach(row => {
            /** @type {FavProperties} */
            const favProperties = getDatabase(APP_USAGE).db.prepare(QUERIES.getFavProperties).get(versionKey, +row.verseId)
            const append = { favouriteId: 0, isFavourite: 0, color: COLORS[0] }
            Object.assign(row, favProperties ?? append)
        })
        return verses
    },
    /**
     * @param {string} versionKey Bible KEY
     * @returns {FavouriteData[]} Data of all favourites in certain bible version
     */
    favourites: (versionKey) => {
        const appUsageDB = getDatabase(APP_USAGE)
        /** @type {FavouriteData[]} */
        const favourites = appUsageDB.db.prepare(QUERIES.favourites).all(versionKey)
        const bibleDB = getDatabase(versionKey)
        if (!bibleDB) { throw new DataOperationEx('Unknown versionKey', []) }
        favourites.forEach(row => {
            const b = DATA_OPERATIONS.getBook(versionKey, +row.bookId)
            /** @type {VerseData | undefined} */
            const v = bibleDB.db.prepare(QUERIES.getVerse).get(+row.verseId)
            row.chapterId = v?.chapterId
            row.verseOrdinal = v?.verseOrdinal
            row.text = v?.text
            row.bookName = b?.name
            row.bookAbr = b?.abr
        })
        return favourites
    },
    /**
     * @param {string} versionKey Bible KEY
     * @param {VerseData} inVerse Only if `isFavourite` is `1` then `color` is set to be `favourite`
     * @returns {InsertResp} Insert success info
     */
    addFavourite: (versionKey, inVerse) => {
        const color = +inVerse.isFavourite === 1 ? COLORS[1] : inVerse.color
        if (+inVerse.favouriteId === 0) {
            const bibleDB = getDatabase(versionKey)
            if (!bibleDB) { throw new DataOperationEx('Unknown versionKey') }
            const b = DATA_OPERATIONS.getBook(versionKey, +inVerse.bookId)
            /** @type {VerseData | undefined} */
            const v = bibleDB.db.prepare(QUERIES.getVerse).get(+inVerse.verseId)
            if (b && v) {
                const result = getDatabase(APP_USAGE).db.prepare(QUERIES.addFavourite).run(versionKey, +b.bookId, +v.verseId, +inVerse.isFavourite, color)
                const template = isEnglish(versionKey) ? FAVOURITE_ADDED_EN : FAVOURITE_ADDED_ES
                const msg = replace(template, b.abr, v.chapterId, v.verseOrdinal)
                return { msg: msg, newId: result.lastInsertRowid }
            } else throw new DataOperationEx('Cannot add favourite - Invalid inVerse')
        } else throw new DataOperationEx('Verse already in favourites')
    },
    /**
     * @param {string} versionKey Bible KEY
     * @param {number} favouriteId Favourite ID to remove
     * @returns {UpdateResp} Update success info
     */
    removeFavourite: (versionKey, favouriteId) => {
        const appUsageDB = getDatabase(APP_USAGE)
        const result = appUsageDB.db.prepare(QUERIES.removeFavourite).run(+favouriteId)
        const template = isEnglish(versionKey) ? FAVOURITE_REMOVED_EN : FAVOURITE_REMOVED_ES
        const noChanges = isEnglish(versionKey) ? NO_CHANGES_EN : NO_CHANGES_ES
        const msg = result.changes > 0 ? replace(template, versionKey.toUpperCase()) : noChanges
        return { msg: msg, changes: result.changes }
    },
    /**
     * @param {string} versionKey Bible KEY
     * @param {VerseData} inVerse If `color`=`normal` favourite is removed — If `color`=`favourite` error is thrown
     * @returns {UpdateResp | InsertResp} Update or Insert success info
     */
    updateColor: (versionKey, inVerse) => {
        const bibleDB = getDatabase(versionKey)
        if (!bibleDB) { throw new DataOperationEx('Unknown versionKey') }
        /** @type {FavProperties} */
        const favProperties = getDatabase(APP_USAGE).db.prepare(QUERIES.getFavProperties).get(versionKey, +inVerse.verseId)
        /** @type {VerseData | undefined} */
        const verseData = bibleDB.db.prepare(QUERIES.getVerse).get(+inVerse.verseId)
        Object.assign(verseData, favProperties);
        if (+verseData.favouriteId > 0) { // Verse is favourites table
            if (COLORS[0] === inVerse.color) {
                const output = DATA_OPERATIONS.removeFavourite(versionKey, +verseData.favouriteId)
                return output
            } else { // other color => then update color
                if (+inVerse.isFavourite === 1) { throw new DataOperationEx(`Verse has 'favourite' color set. Remove from favourites before changing its color.`) }
                const result = getDatabase(APP_USAGE).db.prepare(QUERIES.updateColor).run(inVerse.color, 0, +verseData.favouriteId)
                const template = isEnglish(versionKey) ? FAVOURITE_RECOLORED_EN : FAVOURITE_RECOLORED_ES
                const msg = replace(template, inVerse.color)
                return { msg: msg, changes: result.changes }
            }
        } else { // add verse to favourites table => then update color
            inVerse.isFavourite = 0
            const result = DATA_OPERATIONS.addFavourite(versionKey, inVerse)
            const template = isEnglish(versionKey) ? FAVOURITE_COLORED_EN : FAVOURITE_COLORED_ES
            const msg = replace(template, result.msg, inVerse.color)
            return { msg: msg, newId: result.newId }
        }
    },
    /**
     * @param {string} versionKey Bible KEY
     * @param {LookupValue} inLookupVal What to search for
     * @returns {LookupResp[]} Promise with all search matches in certain bible version
     */
    fastSearch: (versionKey, inLookupVal) => {
        const bibleDB = getDatabase(versionKey)
        if (!bibleDB) { throw new DataOperationEx('Unknown versionKey', []) }
        const searchFor = inLookupVal.searchFor.trim()
        if (searchFor.length === 0) { return [] } // RETURN empty []
        const ifBook = splitBookName(searchFor)
        if (BY_QUOTE === inLookupVal.lookupMode) { // Search by BIBLE QUOTE
            const availBooks = bibleDB.db.prepare(QUERIES.resultOfBooks).all(`%${ifBook}%`)
            if (availBooks.length === 0) { return [] } // RETURN empty []
            const quoteNumbers = searchFor.substring(ifBook.length).trim().split(' ')
            const ifChapter = Number.parseInt(quoteNumbers[0])
            if (Number.isFinite(ifChapter)) { // query for a chapter's verses
                /** @type {LookupResp[]} */
                const availVerses = bibleDB.db.prepare(QUERIES.resultOfVerses).all(`%${ifBook}%`, ifChapter)
                if (availVerses.length) { // There is verses
                    if (quoteNumbers.length > 1) { // There is full bible quote
                        const ifVerse = Number.parseInt(quoteNumbers[1])
                        const bibleQuote = availVerses.find(v => v.verseOrdinal === ifVerse)
                        return bibleQuote ? [bibleQuote] : [] // RETURN bible quote (bookId, chapterId, verseOrdinal) empty []
                    } // unknown / no verse => then return all verses
                    return availVerses // RETURN verses of book-chapter (bookId, chapterId, verseOrdinal)[]
                } // there are NO verses for that chapter
                return availBooks // RETURN books (bookId)[]
            } // invalid chapter num => then just return the books
            return availBooks // RETURN books (bookId)[]
        } else { // Then search by BIBLE TEXT
            if (searchFor.length < MIN_TEXT_LEN) { return [] } // RETURN empty []
            const availTexts = bibleDB.db.prepare(QUERIES.resultOfText).all(`%${searchFor}%`)
            return availTexts // RETURN texts (bookId, chapterId, verseOrdinal, text)[]
        }
    },
    /**
     * @param {ClientReport} inReport Client report data
     * @returns {InsertResp} Insert success info
     */
    addReport: (inReport) => {
        const { appVersion, versionKey, typeId, verseId, feedback } = inReport
        const appFeedbackDB = getDatabase(APP_FEEDBACK)
        const result = appFeedbackDB.db.prepare(QUERIES.addReport).run(appVersion, versionKey, +typeId, +verseId, feedback)
        const template = isEnglish(inReport.getVersionKey()) ? ADDED_REPORT_EN : ADDED_REPORT_ES
        return { msg: template, newId: result.lastInsertRowid }
    },
    /** @returns {UpdateResp} Update success info */
    defragment: () => {
        const appUsageDB = getDatabase(APP_USAGE).db.exec('VACUUM')
        return { msg: DEFRAGMENT_EN, changes: 0 }
    },
}

module.exports = {
    /** Wrapper for all database operations this app handles */
    DataOperations: DATA_OPERATIONS,
}