'use strict'

const express = require('express')
const router = express.Router()
const ResetPasswordController = require('../controllers/ResetPasswordController')

router.post('/request/:email', async (req, res) => {
  try {
    const result = await ResetPasswordController.request(req.params.email)
    return res.json({ error: false, code: 200, data: result })
  } catch (err) {
    return res.status(404).json({ error: true, code: 404, message: err.message })
  }
})

router.post('/:token', async (req, res) => {
  try {
    const result = await ResetPasswordController.reset(req.params.token, req.body.password)
    return res.json({ error: false, code: 200, data: result })
  } catch (err) {
    return res.status(500).json({ error: true, code: 422, message: err.message })
  }
})

module.exports = router
