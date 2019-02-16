const error = require('../middleware/error')
const users = require('../routes/users')
const auth = require('../routes/auth')
const express = require('express')

module.exports = function(app) {
  app.use(express.json())

  // Routes
  app.use(`/api/v1/users`, users)
  app.use(`/api/v1/auth`, auth)
  
  app.use(error)
}