const auth = require('../middleware/auth')
const bcrypt = require('bcrypt')
const { pick } = require('lodash')
const { User, validate } = require('../models/users')
const { Roles } = require('../models/roles')
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

router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered')

    user = new User(pick(req.body, ['firstname', 'lastname', 'email', 'password', 'phone', 'cuit']))
    const salt = await bcrypt.genSalt(10)
    let roles = await Roles.findOne({ keyword: 'producer' })

    user.password = await bcrypt.hash(user.password, salt)
    user.roles = [{ _id: roles._id }]

    if (!req.body.roles) {
      const roles = await Roles.findOne({ keyword: 'producer' })
      user.roles = [{ _id: roles._id }]
    } else {
      user.roles = [req.body.roles]
    }

    await user.save()

    const token = user.generateAuthToken()
    
    res.status(200).json({
      user: pick(user, ['_id', 'firstname', 'lastname', 'email', 'cuit', 'phone', 'roles']),
      token
    })

  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router