require('dotenv').config()
require('console-stamp')(console, {
  metadata: function () {
    return '[' + process.memoryUsage().heapUsed / (1024 * 1024) + ']'
  },
  colors: {
    stamp: 'yellow',
    label: 'white',
    metadata: 'green',
  },
})

const fileUpload = require('express-fileupload')
const stagesName = require('./helpers').stagesName

global.__basedir = __dirname
global.stagesName = stagesName

const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')

const routes = require('./routes')
const models = require('./models')

const app = express()
app.server = http.createServer(app)

const corsOptions = {
  exposedHeaders: ['Content-Range'],
  origin: '*',
}

app.use(morgan('tiny'))

// Middleware express
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use(fileUpload())
app.use(cors(corsOptions))

app.use('/v1', routes)

app.use(function (err, req, res, next) {
  if (!err) return next()

  res.locals.message = err.message
  res.locals.error = err

  res.status(err.status || 500)
  res.json(err)
})

// catch 404. 404 should be consider as a default behavior, not a system error.
app.use(function (req, res, next) {
  res.status(404)
  res.json('Not Found')
})

models.sequelize
  .sync()
  .then(function () {
    console.log('Nice! Database looks fine')
  })
  .catch(function (err) {
    console.log(err, 'Something went wrong with the Database Update!')
  })

const PORT = process.env.PORT || 3333

app.server.listen(PORT, () => {
  console.log(`Server is running on: ${PORT}`)
})
