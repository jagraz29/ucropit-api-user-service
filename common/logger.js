const winston = require('winston')
require('winston-mongodb')

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.MongoDB({  db: process.env.MONGO_CONNECTION, level: 'error' }),
    new winston.transports.File({ filename: 'applog.log' })
  ]
});

module.exports = logger