require('dotenv').config()

const express = require('express')
const cors = require('cors')
const logger = require('morgan')
const bodyParser = require('body-parser')
const http = require('http')
const winston = require('./config/winston')
const app = express()

const models = require('./models')
const routes = require('./routes')

models.sequelize.sync().then(() => {
    console.log('Nice! Database looks fine')
}).catch((err) => {
    console.log(err, 'Something went wrong with the Database Update!')
})

const whitelist = [ 'http://localhost:3000' ]
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(winston.routeLogger)

app.use("/v1", routes);

app.use(winston.errorLogger)

const port = process.env.PORT || 8000;

app.set('port', port);

const server = http.createServer(app);

server.listen(port);

module.exports = app;