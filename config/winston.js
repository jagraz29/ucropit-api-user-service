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
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
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