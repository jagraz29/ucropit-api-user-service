const mongoose = require('mongoose')
const express = require('express')
const app = express()
const users = require('./routes/users')

app.use(express.json())
app.use(`/api/v1/users`, users)

mongoose.connect('mongodb://localhost/ucropit_users', { 
  useNewUrlParser: true,
  useCreateIndex: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error(err))

  app.listen(3000, () => {
    console.log(`Server is listen on 3000`)
  })