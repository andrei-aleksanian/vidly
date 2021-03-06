require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');

winston.addColors({
    silly: 'magenta',
    debug: 'blue',
    verbose: 'cyan',
    info: 'green',
    warn: 'yellow',
    error: 'red'
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({ level: 'error' }),
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/application.log' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './logs/exceptions.log' })
    ],
    exitOnError: true
});

function handleRejections() {
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}
module.exports.handleRejections = handleRejections;
module.exports.logger = logger;
