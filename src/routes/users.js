'use strict'

const express = require('express')
const router = express.Router()
const { stringify, parse } = require('flatted/cjs')

const UserController = require('../controllers/UserController')

router.get('/croptype/:cropTypeId', (req, res) => {
  const { cropTypeId } = req.params

  UserController.sings(cropTypeId)
    .then((result) => {
      return res.json({
        error: false,
        code: 200,
        data: parse(stringify(result)),
      })
    })
    .catch((error) => {
      return res.json({ error: true, code: 500, message: error })
    })
})

module.exports = router
