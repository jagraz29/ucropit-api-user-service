require('dotenv').config()

const express = require('express')
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