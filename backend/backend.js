const express = require('express')
const compression = require('compression')
const cors = require('cors')
const { dblink } = require('./dblink')
const lookup = require('./lookup')
const tipsAndErrors = require('./tips-and-errors')
const logger = require('./logger')

const app = express()
const appName = 'rv60bible'
const version = '1.0.2'
let server

const routes = {
    root: '/',
    versions: '/versions',
    getVersion: '/versions/:versionId',
    books: '/versions/:versionId/books',
    getBook: '/versions/:versionId/books/:bookId',
    verses: '/versions/:versionId/books/:bookId/chapters/:chapterId/verses',
    getFavourites: '/versions/:versionId/favourites',
    setFavourite: '/versions/:versionId/favourites',
    setColors: '/versions/:versionId/colors',
    lookup: '/versions/:versionId/lookup',
    setError: '/errors'
}

app.use(express.json(), compression({ level: 9 }), cors())

const backend = {
    start: () => {
        server = app.listen(0, '127.0.0.1', () => console.log(`${appName} v${version} server is listening on http://${server.address().address}:${server.address().port}`))
        return server
    },
    stop: () => {
        server.close(() => {
            dblink.closeAll()
            tipsAndErrors.closeAll()
            console.log(`${appName} server has closed`)
        })
    },
}

// endpoint GET (/)
app.get(routes.root, (req, res) => {
    res.status(200).json({ message: `${appName} server v${version} is running` })
})

// endpoint GET (/versions)
app.get(routes.versions, async (req, res) => {
    const result = await dblink.versions()
    res.status(result.status).json(result.content)
})

// enpoint GET (/versions/:versionId)
app.get(routes.getVersion, async (req, res) => {
    const { versionId } = req.params
    const result = await dblink.getVersion(versionId)
    res.status(result.status).json(result.content)
})

// endpoint GET (/versions/:versionId/books)
app.get(routes.books, async (req, res) => {
    const { versionId } = req.params
    const result = await dblink.books(versionId)
    res.status(result.status).json(result.content)
})

// endpoint GET (/versions/:versionId/books/:bookId)
app.get(routes.getBook, async (req, res) => {
    const { versionId, bookId } = req.params
    const result = await dblink.getBook(versionId, bookId)
    res.status(result.status).json(result.content)
})

// endpoint GET (/versions/:versionId/books/:bookId/chapters/:chapterId/verses)
app.get(routes.verses, async (req, res) => {
    const { versionId, bookId, chapterId } = req.params
    const result = await dblink.verses(versionId, bookId, chapterId)
    res.status(result.status).json(result.content)
})

// endpoint GET (/versions/:versionId/favourites)
app.get(routes.getFavourites, async (req, res) => {
    const { versionId } = req.params
    const result = await dblink.getFavourites(versionId)
    res.status(result.status).json(result.content)
})

// endpoint PUT (/versions/:versionId/favourites)
app.put(routes.setFavourite, async (req, res) => {
    const { versionId } = req.params
    const data = req.body
    const result = await dblink.setFavourite(versionId, data)
    res.status(result.status).json(result.content)
})

// endpoint PUT (/versions/:versionId/colors)
app.put(routes.setColors, async (req, res) => {
    const { versionId } = req.params
    const data = req.body
    const result = await dblink.setColors(versionId, data)
    res.status(result.status).json(result.content)
})

// endpoint GET (/versions/:versionId/lookup)
app.post(routes.lookup, async (req, res) => {
    const { versionId } = req.params
    const data = req.body
    const result = await lookup.fastSearch(versionId, data)
    res.status(result.status).json(result.content)
})

// endpoint POST (/errors)
app.post(routes.setError, async (req, res) => {
    const data = req.body
    const result = await tipsAndErrors.setError(data)
    res.status(result.status).json(result.content)
})

// enpoint global error handler
app.use((err, req, res, next) => {
    logger.error('(core)\n', err)
    let status;
    switch (err.message) {
        case 'Not found': status = 404; break
        case 'Invalid argument': status = 422; break
        default: status = 500
    }
    res.status(status).json({ error: err.message, cause: err.cause || 'Internal Server Error' })
})

// default endpoint ALL (?)
app.use((req, res) => {
    res.status(404).send({ messaje: 'That was not found, sorry' })
})

module.exports = backend;