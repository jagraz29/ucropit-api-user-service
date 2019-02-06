require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const app = express()
const users = require('./routes/users')
const auth = require('./routes/auth')

app.use(express.json())
app.use(`/api/v1/users`, users)
app.use(`/api/v1/auth`, auth)

mongoose.connect(process.env.MONGO_CONNECTION, { 
  useNewUrlParser: true,
  useCreateIndex: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err))

  app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`Server is listen on 3000`)
  })