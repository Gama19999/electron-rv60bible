/** Sqlite3 connection module */
const sqlite3 = require('sqlite3').verbose()
const util = require('../electron/util')

let es_rv60;
let es_rv1960_fv;
const queries = {
    books: 'select book_id as bi, use_name as un, abbreviation as abr, new_testament as nt, chapter_count as cc from books',
    versesForth: 'select rowid as id, book_id as bi, chapter_num as cn, verse_num as vn, verse_txt as vt from verses as v where bi = ? and cn = ? and vn > ? limit ?',
    versesBack: 'select rowid as id, book_id as bi, chapter_num as cn, verse_num as vn, verse_txt as vt from verses as v where bi = ? and cn = ? and vn >= ? limit ?',
    isFavourite: 'select * from favourites where verse_id = ?',
    addVerse: `insert into favourites values (?, ?, ?, ?, ?, DATE('NOW'))`,
    removeVerse: 'delete from favourites where verse_id = ?',
    favourites: 'select verse_id as vi, book_id as bi, chapter_num as cn, verse_num as vn, verse_txt as vt, added as ad from favourites'
}

/**
 * Object that handles management of data stored in Sqlite3
 */
const DBLINK = {
    /**
     * Opens the required Sqlite3 connections
     */
    open: function(){
        es_rv60 = new sqlite3.Database(util.getPath('..', 'data', 'sources', 'es-rv1960'), sqlite3.OPEN_READONLY, (err) => util.dbError(err, 'es-rv1960 opened!'))
        es_rv1960_fv = new sqlite3.Database(util.getPath('..', 'data', 'sources', 'es-rv1960-fv'), sqlite3.OPEN_READWRITE, (err) => util.dbError(err, 'es-rv1960-fv opened!'))
    },
    /**
     * Retrieves all books from Sqlite3
     * @return Promise containing an array of JSON structured as:<br>
     * <i>{bookId, bookName, bookShort, bookTestament, bookChCount}</i>
     */
    getAllBooks: async function() {
        return new Promise((resolve) => {
            const books = [];
            es_rv60.serialize(() => {
                es_rv60.each(queries.books, (err, row) => {
                    util.dbError(err)
                    books.push({bookId: `${row.bi}`,
                                bookName: row.un,
                                bookShort: row.abr,
                                bookTestament: `${row.nt}`,
                                bookChCount: `${row.cc}`})
                }, (err, total) => {
                    util.dbError(err, `getAllBooks - Retrieved books: ${total}`)
                    resolve(books)
                })
            })
        })
    },
    /**
     * Retrieves verse data of a given book and chapter based on direction of search
     * @param vr VerseRequest as a JSON with the structure:<br>
     * <i>bookId: string - Book ID to search<br>
     * chapterNum: string - Chapter of book to get the verses from<br>
     * verseNum: string - Verse search starting point<br>
     * limit: number - Number of verses to fetch<br>
     * forth: boolean - Flag that enables forward search - If false, search is backwards</i>
     * @returns Promise containing an array of JSON structured as:<br>
     * <i>{verseId, bookId, chapterNum, verseNum, verseTxt}</i>
     */
    getVersesOn: async function(vr) {
        return new Promise((resolve) => {
            const verses = []
            es_rv60.serialize(() => {
                const query = vr.forth ? queries.versesForth : queries.versesBack;
                const params = [vr.bookId, vr.chapterNum, vr.forth ? (vr.verseNum ? vr.verseNum : 0) : (+vr.verseNum === 1 ? 1000 : +vr.verseNum - vr.limit), vr.limit];
                const stmt = es_rv60.prepare(query, params, (err) => util.dbError(err, 'getVersesOn - Binding success!'))
                stmt.each((err, row) => {
                    util.dbError(err)
                    verses.push({verseId: `${row.id}`,
                                 bookId: `${row.bi}`,
                                 chapterNum: `${row.cn}`,
                                 verseNum: `${row.vn}`,
                                 verseTxt: row.vt})
                }, (err, total) => {
                    util.dbError(err, `getVersesOn - bookId: ${vr.bookId} chapterNum: ${vr.chapterNum} verseNum: ${vr.verseNum} limit: ${total} forth: ${vr.forth}`)
                    resolve(verses)
                })
                stmt.finalize()
            })
        })
    },
    /**
     * Evaluates whether a verse ID is stored as favourite or not
     * @param verseId Unique verse identifier as a string
     * @returns Promise containing a boolean indicating favourite state
     */
    isFavourite: async function(verseId) {
        return new Promise((resolve) => {
            es_rv1960_fv.serialize(() => {
                const stmt = es_rv1960_fv.prepare(queries.isFavourite, verseId, (err) => util.dbError(err, 'isFavourite - Binding success!'))
                stmt.get((err, row) => {
                    util.dbError(err, `verseId: ${verseId} ${row ? 'IS' : 'IS NOT'} marked as favourite`)
                    resolve(!!row)
                })
                stmt.finalize()
            })
        })
    },
    /**
     * Stores a verse as a new favourite
     * @param verseData Favourite data to save structured as:<br>
     * <i>verseId: string - Unique verse identifier<br>
     * bookId: string - Unique book identifier<br>
     * chapterNum: string - Chapter of the book<br>
     * verseNum: string - Verse number to save<br>
     * verseTxt: string - Content of the verse</i>
     */
    addFavourite: function(verseData) {
        es_rv1960_fv.serialize(() => {
            const params = [verseData.verseId, verseData.bookId, verseData.chapterNum, verseData.verseNum, verseData.verseTxt]
            const stmt = es_rv1960_fv.prepare(queries.addVerse, params, (err) => util.dbError(err, 'addFavourite - Binding success!'))
            stmt.run(function() { util.dbError(arguments[0], `verseId: ${verseData.verseId} saved as favourite!`) })
            stmt.finalize()
        })
    },
    /**
     * Removes a verse from favourites
     * @param verseId Unique verse identifier as string
     */
    removeFavourite: function(verseId) {
        es_rv1960_fv.serialize(() => {
            const stmt = es_rv1960_fv.prepare(queries.removeVerse, verseId, (err) => util.dbError(err, 'removeFavourite - Binding success!'))
            stmt.run(function() { util.dbError(arguments[0], `verseId: ${verseId} removed from favourites!`) })
            stmt.finalize()
        })
    },
    /**
     * Retrieves all favourites from Sqlite3
     * @returns Promise containing an array of JSON structured as:<br>
     * <i>{verseId, bookId, chapterNum, verseNum, verseTxt, added}</i>
     */
    getAllFavourites: function() {
        return new Promise((resolve) => {
            const favourites = []
            es_rv1960_fv.serialize(() => {
                es_rv1960_fv.each(queries.favourites, (err, row) => {
                    util.dbError(err)
                    favourites.push({verseId: `${row.vi}`,
                                     bookId: `${row.bi}`,
                                     chapterNum: `${row.cn}`,
                                     verseNum: `${row.vn}`,
                                     verseTxt: `${row.vt}`,
                                     added: `${row.ad}`})
                }, (err, total) => {
                    util.dbError(err, `getAllFavourites - Retrieved favourites: ${total}`)
                    resolve(favourites)
                })
            })
        })
    },
    /**
     * Closes the current Sqlite3 connections
     */
    close: function() {
        es_rv60.close()
        es_rv1960_fv.close()
    }
}

module.exports = DBLINK;