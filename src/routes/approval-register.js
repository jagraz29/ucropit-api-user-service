"use strict";

const express = require("express")
const router = express.Router()
const ApprovalsRegisterController = require("../controllers/ApprovalsRegisterController")

router.get('/crops/:idCrop/stages/:stage', async (req, res) => {
  try {
    const { idCrop, stage } = req.params
    const register = await ApprovalsRegisterController.show(idCrop, stage)

    return res.json({ code: 200, error: false, register })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

router.post('/crops/:idCrop/stages/:stage/signs', async (req, res) => {
  try {
    const { idCrop, stage } = req.params
    const register = await ApprovalsRegisterController.sign(req.body, idCrop, stage, req.decoded)

    return res.json({ code: 200, error: false, register })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

module.exports = router
