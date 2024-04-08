const path = require('path');
const winston = require('winston');
const format = winston.format
const DailyRotateFile = require('winston-daily-rotate-file');

const outputFormat = format.printf((info) => {
    return `[${info.level.toUpperCase()}] ${info.timestamp}: ${info.message}`
})

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        outputFormat
    ),
    transports: [
        new winston.transports.File({
            filename: path.resolve(path.join('../data/logs', `output.log`))
        })
    ]
})

module.exports = logger