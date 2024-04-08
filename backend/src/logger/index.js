const consoleLogger = require('./console')
const fileLogger = require('./file')
const outputLogger = require('./output')

const logger = {
    info: (msg) => {
        consoleLogger.info(msg)
        fileLogger.info(msg)
        outputLogger.info(msg)
    },
    warn: (msg) => {
        consoleLogger.warn(msg)
        fileLogger.warn(msg)
        outputLogger.info(msg)
    },
    error: (msg) => {
        consoleLogger.error(msg)
        fileLogger.error(msg)
        outputLogger.info(msg)
    },
    log: (method, msg) => {
        consoleLogger.log(method, msg)
        fileLogger.log(method, msg)
        outputLogger.log(method, msg)
    },
    network: (method, data) => {
        fileLogger.info({
            req_method: method,
            data: data
        })
        if(/\/api\/info\/output/.test(data.url)) return
        consoleLogger.info({
            req_method: method,
            data: data
        })
    }
}

module.exports = logger