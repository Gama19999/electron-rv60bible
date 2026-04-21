/** App databases folder name */
const APP_DATABASES = 'app_databases'

/** App allowed colors */
const COLORS = ['normal', 'favourite', 'color1', 'color2', 'color3', 'color4']

/** Seach mode by bookName chapterId verseId */
const BY_QUOTE = 'byQuote'
/** Minimum lenght to start a search */
const MIN_TEXT_LEN = 4

/** Bible version list ID */
const VERSION_LIST = 'version-list'
/** App feedback ID */
const APP_FEEDBACK = 'app-feedback'
/** App usage ID */
const APP_USAGE = 'app-usage'
/** Wait up to 5s for locks */
const SQLITE_TIMEOUT = 5000

// App message templates
const FAVOURITE_ADDED_EN = 'New favourite %s %s:%s'
const FAVOURITE_ADDED_ES = 'Nuevo favorito %s %s:%s'
const FAVOURITE_REMOVED_EN = 'Removed favourite from %s'
const FAVOURITE_REMOVED_ES = 'Favorito eliminado de %s'
const FAVOURITE_RECOLORED_EN = 'Favourite recolored to %s'
const FAVOURITE_RECOLORED_ES = 'Favorito cambiado a %s'
const FAVOURITE_COLORED_EN = '%s as %s'
const FAVOURITE_COLORED_ES = '%s como %s'
const NO_CHANGES_EN = 'No changes'
const NO_CHANGES_ES = 'Sin cambios'
const ADDED_REPORT_EN = 'Report saved'
const ADDED_REPORT_ES = 'Reporte guardado'
const DEFRAGMENT_EN = 'Defragmented appUsage DB'


/**
 * @typedef {Object} BibleData
 * @property {string} versionKey
 * @property {string} lang
 * @property {string} name
 * @property {string} year
 */

/**
 * @typedef {Object} BookData
 * @property {number} bookId 
 * @property {string} name
 * @property {string} abr
 * @property {number} chapterCount
 * @property {number} bookOfNT `1` or `0`
 * @property {number} bookOrdinal
 * @property {string} author
 * @property {string} date
 */

/**
 * @typedef {Object} VerseData
 * @property {number} verseId
 * @property {number} bookId
 * @property {number} chapterId
 * @property {number} verseOrdinal
 * @property {string} text
 * @property {number} favouriteId
 * @property {number} isFavourite `1` or `0`
 * @property {string} color
 */

/**
 * @typedef {Object} FavProperties
 * @property {number} favouriteId
 * @property {number} isFavourite
 * @property {string} color
 */

/**
 * @typedef {Object} FavouriteData
 * @property {number} favouriteId
 * @property {number} bookId
 * @property {number} verseId
 * @property {number} chapterId
 * @property {number} verseOrdinal
 * @property {string} text
 * @property {number} isFavourite `1` or `0`
 * @property {string} color
 * @property {string} bookName
 * @property {string} bookAbr
 * @property {string} date
 */

/**
 * @typedef {Object} InsertResp
 * @property {string} msg
 * @property {number} newId
 */

/**
 * @typedef {Object} UpdateResp
 * @property {string} msg
 * @property {number} changes
 */

/**
 * @typedef {Object} LookupValue
 * @property {string} searchFor
 * @property {string} lookupMode `byQuote` or `byText`
 */

/**
 * @typedef {Object} ClientReport
 * @property {string} appVersion
 * @property {string} versionKey
 * @property {number} typeId
 * @property {number} [verseId]
 * @property {string} [feedback]
 */

/**
 * @typedef {Object} LookupResp
 * @property {number} bookId
 * @property {string} bookName
 * @property {number} [verseId]
 * @property {number} [chapterId]
 * @property {number} [verseOrdinal]
 * @property {string} [text]
 */

module.exports = {
    APP_DATABASES,
    COLORS,
    BY_QUOTE,
    MIN_TEXT_LEN,
    VERSION_LIST,
    APP_FEEDBACK,
    APP_USAGE,
    SQLITE_TIMEOUT,
    FAVOURITE_ADDED_EN,
    FAVOURITE_ADDED_ES,
    FAVOURITE_REMOVED_EN,
    FAVOURITE_REMOVED_ES,
    FAVOURITE_RECOLORED_EN,
    FAVOURITE_RECOLORED_ES,
    FAVOURITE_COLORED_EN,
    FAVOURITE_COLORED_ES,
    NO_CHANGES_EN,
    NO_CHANGES_ES,
    ADDED_REPORT_EN,
    ADDED_REPORT_ES,
    DEFRAGMENT_EN,
}