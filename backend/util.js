const { COLORS, VerseData, ClientReport } = require('./constants');
const { getDatabase } = require('./databases');

/**
 * @param versionKey Requested bible ID
 * @returns {boolean} `true` if this bible ID is in English — `false` otherwise
 */
function isEnglish(versionKey) {
    const dbEntity = getDatabase(versionKey)
    return dbEntity ? dbEntity.path.startsWith("en") : true
}

/**
 * @param {string} template String with `%s` instances
 * @param {any[]} args Values to use as replacements
 * @returns {string} Replaced string
 */
function replace(template, ...args) {
    if (args) { for (const arg of args) { template = template.replace('%s', arg); } }
    return template;
}

/** Logs errors to console @param {string} type Brief type of error @param {any} error Error object */
function onError(type, error) { console.error(`(${type} error)`, error) }

/** 
 * @param {VerseData} inBody Verse to evaluate
 * @returns {boolean} Whether verse data is valid
 */
function isVerseBodyValid(inBody) {
    return Number.isFinite(Number.parseInt(inBody.verseId)) &&
        Number.isFinite(Number.parseInt(inBody.bookId)) &&
        Number.isFinite(Number.parseInt(inBody.chapterId)) &&
        Number.isFinite(Number.parseInt(inBody.verseOrdinal)) &&
        !!inBody.text &&
        Number.isFinite(Number.parseInt(inBody.favouriteId)) &&
        (+inBody.isFavourite === 1 || +inBody.isFavourite === 0) &&
        COLORS.includes(inBody.color)
}

/** 
 * @param {ClientReport} report Client report to evaluate
 * @return {boolean} Whether client report is valid
 */
function isClientReportValid(report) {
    return !!report.appVersion &&
        !!report.versionKey &&
        (+report.typeId >= 1 && +report.typeId <= 5)
}

/**
 * Extracts the **book name** inside the `searchFor` value
 * @param {string} searchFor Value to search for
 * @returns {string} Validated fragment corresponding to a **book name**
 */
function splitBookName(searchFor) {
    const numberInBookName = Number.parseInt(searchFor.split(' ')[0])
    if (Number.isFinite(numberInBookName)) { // searchFor is like '1 Sam...'
        return numberInBookName + ' ' + (searchFor.split(' ')[1] ?? '')
    } else { // searchFor is like 'gen 4...'
        return searchFor.split(' ')[0]
    }
}

module.exports = {
    isEnglish,
    replace,
    onError,
    isVerseBodyValid,
    isClientReportValid,
    splitBookName,
}