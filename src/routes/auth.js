"use strict";

const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const jwt = require('jsonwebtoken')
const authmiddleware = require('../middlewares/auth')
const createToken = async (user) => await jwt.sign({ user }, process.env.JWT_SECRET)

router.post('/', async (req, res) => {
  try {
    let result = await AuthController.login(req.body)

    if (!result.error) {
      const token = await createToken(result.user)

      return res.status(200).json({
        error: false, code: 200, message: 'Success', data: {
          user: { ...result.user.toJSON() },
          token
        }
      })
    } else {
      return res.status(401).json({ error: true, code: 401, message: result.message })
    }
  } catch (err) {
    console.log(err)
  }
})

router.post('/register', async (req, res) => {
  try {
    let result = await AuthController.register(req.body)

    if (result === null) {
      return res.status(422).json({ error: true, code: 422, message: 'El correo ya fue tomado' })
    }

    const token = await createToken(result)

    res.status(200).json({
      error: false, code: 200, message: 'Success',
      data: {
        user: { ...result.toJSON() },
        token
      }
    })

  } catch (err) {
    return res.status(500).json({ error: true, code: 422, message: err })
  }
})

router.get('/me', authmiddleware.checkToken, async (req, res) => {
  res.json(req.decoded)
});


module.exports = router
