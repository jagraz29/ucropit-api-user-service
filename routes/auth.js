const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { omit } = require('lodash')
const { User } = require('../models/users')
const Joi = require('joi')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(422).send(error.details[0].message)

  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(401).send('Invalid email or password')

  const invalidPassword = await bcrypt.compare(req.body.password, user.password)
  if (!invalidPassword) return res.status(401).send('Invalid email or password')

  const token = jwt.sign({ _id: user._id }, 'theloveofthegod')

  res.send({
    user: omit(user, ['password']),
    token
  })
})

function validate(req) {
  const schema = {
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
  }

  return Joi.validate(req, schema)
}

module.exports = router