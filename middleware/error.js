const logger = require('../common/logger')

module.exports = function(err, req, res, next) {
  logger.log({
    level: 'error',
    message: err.message,
    meta: err.stack
  }); 

  res.status(500).send('Something Failed')
}