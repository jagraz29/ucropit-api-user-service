const winston = require('winston')
const expressWinston = require('express-winston')
const appRoot = require('app-root-path')


const routeLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      maxsize: 512000,
      maxFiles: 5,
      dirname: `${appRoot}/logs`,
      filename: 'request.log'
    })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
})

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      maxsize: 512000,
      maxFiles: 5,
      dirname: `${appRoot}/logs`,
      filename: 'error.log'
    }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
});

module.exports = { errorLogger, routeLogger }