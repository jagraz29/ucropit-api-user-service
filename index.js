require('dotenv').config()

const express = require('express')
const app = express()

require('./startup/log')()
require('./startup/routes')(app)
require('./startup/db')()

app.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is listen on 3000`)
})