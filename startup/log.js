require('express-async-errors')

const logger = require('../common/logger')

module.exports = function () {
  process.on('uncaughtException', (ex) => {
    logger.log({
      level: 'error',
      message: ex.message,
      meta: ex.stack
    })
    process.exit(1)
  })
  
  process.on('unhandledRejection', (ex) => {
    logger.log({
      level: 'error',
      message: ex.message,
      meta: ex.stack
    })
    process.exit(1)
  })
}