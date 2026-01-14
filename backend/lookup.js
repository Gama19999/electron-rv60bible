const { bibles } = require('./dblink');
const logger = require('./logger')

function logError(err) {
    if (err) logger.error('(lookup)\n', err)
}

function checkVersionId(versionId) {
    if (!bibles[versionId]) {
        logger.warn(`versionId: (${versionId}) not found`)
        throw new Error('Not found', { cause: `versionId (${versionId}) not found`, status: 404 })
    }
}

function splitBookName(searchFor) {
    let bookName
    const numberInBookName = Number.parseInt(searchFor.split(' ')[0])
    if (Number.isFinite(numberInBookName)) {
        bookName = numberInBookName + ' ' + searchFor.split(' ')[1]
    } else {
        bookName = searchFor.split(' ')[0]
    }
    return bookName
}

async function resultOfBooks(versionId, ifBook) {
    return new Promise((resolve, reject) => {
        const stmt = bibles[versionId].prepare(queries.fastBooks, logError)
            .bind([`%${ifBook}%`], logError)
            .all((err, rows) => {
                if (err) {
                    logError(err)
                    throw new Error('Server error', { cause: err.message })
                } else resolve(rows)
            })
        stmt.finalize()
    })
}

async function resultOfVerses(versionId, ifBook, ifChapter) {
    return new Promise((resolve, reject) => {
        const stmt = bibles[versionId].prepare(queries.fastChapterVerses, logError)
            .bind([`%${ifBook}%`, ifChapter], logError)
            .all((err, rows) => {
                if (err) {
                    logError(err)
                    throw new Error('Server error', { cause: err.message })
                } else resolve(rows)
            })
        stmt.finalize()
    })
}

async function resultOfText(versionId, ifText) {
    return new Promise((resolve, reject) => {
        const stmt = bibles[versionId].prepare(queries.fastText, logError)
            .bind([`%${ifText}%`], logError)
            .all((err, rows) => {
                if (err) {
                    logError(err)
                    throw new Error('Server error', { cause: err.message })
                } else resolve(rows)
            })
        stmt.finalize()
    })
}

const queries = {
    fastBooks: 'SELECT book_id AS bookId, book_name AS bookName FROM books WHERE book_name_for_search LIKE ?',
    fastChapterVerses: 'SELECT b.book_id AS bookId, b.book_name AS bookName, v.chapter_id AS chapterId, v.verse_ordinal AS verseOrdinal, v.verse_text AS text FROM books AS b, verses AS v WHERE b.book_id = v.book_id AND b.book_name_for_search LIKE ? AND v.chapter_id = ?',
    fastText: 'SELECT b.book_id AS bookId, b.book_name AS bookName, v.chapter_id AS chapterId, v.verse_ordinal AS verseOrdinal, v.verse_text AS text FROM books AS b, verses AS v WHERE b.book_id = v.book_id AND v.verse_text_for_search LIKE ?',
}

const lookup = {
    fastSearch: async (versionId, lookupValue) => {
        checkVersionId(versionId)
        const searchFor = lookupValue.searchFor
        const result = {}
        result.status = 200
        if (!searchFor.trim()) return new Promise((resolve, reject) => { result.content = []; resolve(result) }) // RETURN emply []
        const ifBook = splitBookName(searchFor)//searchFor.split(' ')[0]
        const availBooks = await resultOfBooks(versionId, ifBook)
        if (!searchFor.startsWith('+') && availBooks.length) { // There is books
            const ifChapter = Number.parseInt(searchFor.substring(ifBook.length).trim().split(':')[0])
            if (Number.isFinite(ifChapter)) { // query for a chapter's verses
                const availVerses = await resultOfVerses(versionId, ifBook, ifChapter)
                if (availVerses.length) { // There is verses
                    result.content = availVerses
                    const ifVerse = Number.parseInt(searchFor.substring(ifBook.length).trim().split(':')[1])
                    if (Number.isFinite(ifVerse)) { // There is full bible quote
                        const bibleQuote = availVerses.find((row) => row.verseOrdinal === ifVerse)
                        result.content = [bibleQuote]
                        return new Promise((resolve, reject) => { resolve(result) }) // RETURN bible quote (bookId, chapterId, verseOrdinal)
                    }
                    return new Promise((resolve, reject) => { resolve(result) }) // RETURN verses of book-chapter (bookId, chapterId, verseOrdinal)[]
                } else { // there is NOT verses for that chapter
                    result.content = availBooks
                    return new Promise((resolve, reject) => { resolve(result) }) // RETURN books (bookId)[]
                }
            } else { // just return the books
                result.content = availBooks
                return new Promise((resolve, reject) => { resolve(result) }) // RETURN books (bookId)[]
            }
        } else { // then search for verse plain text
            if (searchFor.length < 6) return new Promise((resolve, reject) => { result.content = []; resolve(result) }) // RETURN emply []
            const text = searchFor.startsWith('+') ? searchFor.substring(1) : searchFor
            const availTexts = await resultOfText(versionId, text)
            result.content = availTexts
            return new Promise((resolve, reject) => { resolve(result) }) // RETURN texts (bookId, chapterId, verseOrdinal, text)[]
        }
    },
}

module.exports = lookup;