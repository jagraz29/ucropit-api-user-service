const winston = require('winston')

module.exports = () => {
  const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
      new winston.transports.Console({
        format: winston.format.simple(),
        colorize: true,
        prettyPrint: true,
        handleExceptions: true,
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
    ],
    exitOnError: false,
  })

  process.on('unhandledRejection', (ex) => {
    throw ex
  })

  global.logger = logger
}
