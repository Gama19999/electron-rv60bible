const logger = {
    info: (msg) => console.log('INFO:', msg),
    warn: (msg, extras) => console.log('WARN:', msg, extras),
    error: (msg, extras) => console.log('ERROR:', msg, extras)
}

module.exports = logger;