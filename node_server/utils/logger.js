'use strict'
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';

const logDir = `${__dirname}/../log`; 
// console.log(logDir, require('path').dirname(logDir))

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleDateString();

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console ({
            timestamp: tsFormat,
            colorize: true,
            level: 'debug'
        }),
        new winston.transports.File({
            filename: `${logDir}/normal.log`,
            timestamp: tsFormat,
            level: 'warn',
        })
    ]
});

module.exports = logger;