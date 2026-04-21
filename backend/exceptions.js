/** Top general app exception */
class AppGeneralEx extends Error {
    /**
     * Top general app exception
     * @param {string} message
     * @param {string} extra
     * @param {number} status 
     */
    constructor(message, extra, status) {
        super(message)
        this.cause = 'Internal server error'
        this.extra = extra
        this.status = status ?? 500
    }
}

/**
 * Caused by Sqlite errors  
 * Caused by client data inconsistencies 
 */
class DataOperationEx extends AppGeneralEx {
    /**
     * Caused by Sqlite errors  
     * Caused by client data inconsistencies 
     * @param {string} extra 
     * @param {any} defaultResult 
     */
    constructor(extra, defaultResult) {
        super('Error white processing request data', extra, 422)
        this.defaultResult = defaultResult
    }
}

/** Caused by URL parameter read error */
class InvalidURLParam extends AppGeneralEx {
    /**
     * Caused by URL parameter read error 
     * @param {string} extra Error extra info
     */
    constructor(extra) { super('Invalid URL parameter', extra, 422) }
}

/** Caused by attaching an invalid body to the request */
class InvalidRequestBody extends AppGeneralEx {
    /**
     * Caused by attaching an invalid body to the request
     * @param {string} extra Error extra info
     */
    constructor(extra) {
        super('Invalid request body', extra, 422)
    }
}

module.exports = {
    AppGeneralEx,
    DataOperationEx,
    InvalidURLParam,
    InvalidRequestBody,
}