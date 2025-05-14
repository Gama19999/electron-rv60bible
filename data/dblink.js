/** Sqlite3 connection module */
const sqlite3 = require('sqlite3').verbose()
const util = require('../electron/util')

let db;
const queries = {
    books: 'select book_id as bi, use_name as un, abbreviation as abr, new_testament as nt, chapter_count as cc from books',
    versesForth: 'select rowid as id, book_id as bi, chapter_num as cn, verse_num as vn, verse_txt as vt from verses as v where bi = ? and cn = ? and vn > ? limit ?',
    versesBack: 'select rowid as id, book_id as bi, chapter_num as cn, verse_num as vn, verse_txt as vt from verses as v where bi = ? and cn = ? and vn >= ? limit ?'
}

/**
 * Object that handles management of data stored in Sqlite3
 */
const DBLINK = {
    /**
     * Opens a new Sqlite3 connection
     */
    open: function(){
        db = new sqlite3.Database(util.getPath('..', 'data', 'es-rv1960'), sqlite3.OPEN_READONLY)
    },
    /**
     * Retrieves all books from Sqlite3
     * @return Promise containing an array of JSON structured as:<br>
     * {bookId,bookName,bookShort,bookTestament,bookChCount}
     */
    getAllBooks: async function() {
        return new Promise((resolve) => {
            const books = [];
            db.serialize(() => {
                db.each(queries.books, (err, row) => {
                    util.dbError(err)
                    books.push({bookId: `${row.bi}`,
                                bookName: row.un,
                                bookShort: row.abr,
                                bookTestament: `${row.nt}`,
                                bookChCount: `${row.cc}`})
                }, (err, total) => {
                    console.log('getAllBooks - Retrieved books:', total)
                    util.dbError(err)
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
            db.serialize(() => {
                const query = vr.forth ? queries.versesForth : queries.versesBack;
                const params = [vr.bookId, vr.chapterNum, vr.forth ? (vr.verseNum ? vr.verseNum : 0) : (+vr.verseNum === 1 ? 1000 : +vr.verseNum - vr.limit), vr.limit];
                const stmt = db.prepare(query, params,
                                       (err) => console.log(!err ? 'getVersesOn - Binding success!' : `getVersesOn - Binding error:\n${err}`))
                stmt.each((err, row) => {
                    util.dbError(err)
                    verses.push({verseId: `${row.id}`,
                                 bookId: `${row.bi}`,
                                 chapterNum: `${row.cn}`,
                                 verseNum: `${row.vn}`,
                                 verseTxt: row.vt})
                }, (err, total) => {
                    console.log('getVersesOn - bookId:', vr.bookId, 'chapterNum:', vr.chapterNum, 'verseNum:', vr.verseNum, 'limit:', total, 'forth:', vr.forth);
                    util.dbError(err)
                    resolve(verses)
                })
                stmt.finalize()
            })
        })
    },
    /**
     * Closes current Sqlite3 connection
     */
    close: function closeDB() { db.close() }
}

module.exports = DBLINK;