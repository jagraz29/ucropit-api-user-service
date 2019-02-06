const auth = require('../middleware/auth')
const bcrypt = require('bcrypt')
const { pick } = require('lodash')
const { User, validate } = require('../models/users')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
    res.send(users)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.post('/', auth, async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered')

    user = new User(pick(req.body, ['firstname', 'lastname', 'email', 'password', 'phone', 'cuit']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    
    await user.save()
    
    res.send(
      pick(user, ['_id', 'firstname', 'lastname', 'email', 'cuit', 'phone'])
    )

  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router