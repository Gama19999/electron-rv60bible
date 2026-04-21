const express = require('express')
const compression = require('compression')
const cors = require('cors')
const { DataOperations } = require('./data-operations')
const { onError, isVerseBodyValid, isClientReportValid } = require('./util')
const { InvalidURLParam, InvalidRequestBody, AppGeneralEx } = require('./exceptions')

const app = express()
const appName = 'rv60bible'
const appVersion = '2.1.0'
const allowedCORS = /^(http:\/\/127\.0\.0\.1:\d+|http:\/\/localhost:\d+)$/;
const address = '127.0.0.1'
const port = 0 // Environment => Electron
const routes = {
    root: '/',
    versions: '/versions',
    getVersion: '/versions/:versionKey',
    books: '/versions/:versionKey/books',
    getBook: '/versions/:versionKey/books/:bookId',
    verses: '/versions/:versionKey/books/:bookId/chapters/:chapterId/verses',
    favourites: '/versions/:versionKey/favourites',
    lookup: '/versions/:versionKey/lookup',
    reports: '/app/reports',
    defragment: '/app/defragment',
}

// Only work with JSON and send ultra compressed responses 
app.use(express.json(), compression({ level: 9 }))
// Only accept incoming requests fom same machine
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // Allow requests with no origin (like mobile apps or curl requests)
        if (allowedCORS.test(origin)) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    }
}))

/** Http server that handles incoming connections @type {import('http').Server} */
const server = app.listen(port, address, () => {
    console.log(`${appName} (v${appVersion}) is running`)
    console.log(`Server listening on (http://${server.address().address}:${server.address().port})`) 
})

// API information — GET (/)
app.get(routes.root, (req, res) => {
    const msg = { msg: `${appName} (v${appVersion}) is running`, extra: `Server listening on (http://${server.address().address}:${server.address().port})` }
    res.status(200).json(msg)
})

// Retrieves data of all bible versions — GET (/versions)
app.get(routes.versions, async (req, res) => {
    const versions = DataOperations.versions()
    res.status(200).json(versions)
})

// Retrieves data of a single bible version — GET (/versions/:versionKey)
app.get(routes.getVersion, async (req, res) => {
    const { versionKey } = req.params
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    const version = DataOperations.getVersion(versionKey)
    res.status(200).json(version)
})

// Retrieves data of all books in a bible version — GET (/versions/:versionKey/books)
app.get(routes.books, async (req, res) => {
    const { versionKey } = req.params
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    const books = DataOperations.books(versionKey)
    res.status(200).json(books)
})

// Retrieves data of a single book in a bible version —  GET (/versions/:versionKey/books/:bookId)
app.get(routes.getBook, async (req, res) => {
    const { versionKey, bookId } = req.params
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    if (!bookId) { throw new InvalidURLParam({ 'bookId': bookId }) }
    const book = DataOperations.getBook(versionKey, bookId)
    res.status(200).json(book)
})

// Retrieves data of all verses in a chapter's book in a bible version — GET (/versions/:versionKey/books/:bookId/chapters/:chapterId/verses)
app.get(routes.verses, async (req, res) => {
    const { versionKey, bookId, chapterId } = req.params
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    if (!bookId) { throw new InvalidURLParam({ 'bookId': bookId }) }
    if (!chapterId) { throw new InvalidURLParam({ 'chapterId': chapterId }) }
    const verses = DataOperations.verses(versionKey, bookId, chapterId)
    res.status(200).json(verses)
})

// Retrieves data of all favourites in a bible version — GET (/versions/:versionKey/favourites)
app.get(routes.favourites, async (req, res) => {
    const { versionKey } = req.params
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    const favourites = DataOperations.favourites(versionKey)
    res.status(200).json(favourites)
})

// Creates a favourite in a bible version — POST (/versions/:versionKey/favourites)
app.post(routes.favourites, async (req, res) => {
    const { versionKey } = req.params
    const inBody = req.body
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    if (!inBody || !isVerseBodyValid(inBody)) { throw new InvalidRequestBody(JSON.stringify(inBody)) }
    const result = DataOperations.addFavourite(versionKey, inBody)
    res.status(201).json(result)
})

// Removes a favourite in a bible version — DELETE (/versions/:versionKey/favourites/:favouriteId)
app.delete(routes.favourites + '/:favouriteId', async (req, res) => {
    const { versionKey, favouriteId } = req.params
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    if (!favouriteId) { throw new InvalidURLParam({ 'favouriteId': favouriteId }) }
    const result = DataOperations.removeFavourite(versionKey, favouriteId)
    res.status(200).json(result)
})

// Modifies a favourite color in a bible version — PUT (/versions/:versionKey/favourites)
app.put(routes.favourites  + '/:favouriteId', async (req, res) => {
    const { versionKey, favouriteId } = req.params
    const inBody = req.body
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    if (!favouriteId) { throw new InvalidURLParam({ 'favouriteId': favouriteId }) }
    if (!inBody || !isVerseBodyValid(inBody)) { throw new InvalidRequestBody(JSON.stringify(inBody)) }
    const result = DataOperations.updateColor(versionKey, inBody)
    res.status(result.newId ? 201 : 200).json(result)
})

// Retrieves search matches in a bible version — POST (/versions/:versionKey/lookup)
app.post(routes.lookup, async (req, res) => {
    const { versionKey } = req.params
    const inBody = req.body
    if (!versionKey) { throw new InvalidURLParam({ 'versionKey': versionKey }) }
    const fastSearch = DataOperations.fastSearch(versionKey, inBody)
    res.status(200).json(fastSearch)
})

// Creates an app error report — POST (/app/reports)
app.post(routes.reports, async (req, res) => {
    const inBody = req.body
    if (!inBody || !isClientReportValid(inBody)) { throw new InvalidRequestBody(JSON.stringify(inBody)) }
    const result = DataOperations.addReport(inBody)
    res.status(201).json(result)
})

// Defragments AppUsageDB to enhance performance — GET (/app/defragment)
app.get(routes.defragment, async (req, res) => {
    const result = DataOperations.defragment()
    res.status(200).json(result)
})

// Global Error Handler
app.use((err, req, res, next) => {
    onError('server', err)
    if (err instanceof AppGeneralEx) {
        /** @type {AppGeneralEx} */ 
        const e = err;
        const serverMessage = { error: e.cause, msg: e.message, extra: e.extra }
        res.status(e.status).json(serverMessage)
    }
    const ex = new AppGeneralEx(err.message, err.cause)
    res.status(ex.status).json(ex)
})

// Default Endpoint ALL (/**)
app.use((req, res) => {
    res.status(404).send({ messaje: 'No resource found at URI', uri: req.url })
})

/** 
 * Closes server opened connections before program exit
 * @param {any} val Exit value
 */
function closeServer(val) {
    console.log('EXIT', val)
    server.close(() => console.log(`${appName} (v${appVersion}) stopped listening`))
}

/** @returns {string} The running server address as `http://127.0.0.1:*` */
function getServerAddress() {
    return `http://${server.address().address}:${server.address().port}`
}

module.exports = {
    getServerAddress,
    closeServer,
}