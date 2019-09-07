"use strict";

const express = require("express")
const router = express.Router()
const ApplicationsController = require("../controllers/ApplicationsController")

router.post('/:idCrop/stage/:stage', async (req, res) => {
  try {
    const lot = await ApplicationsController.create(req.params.idCrop, req.params.stage)

    return res.json({ code: 200, error: false, lot })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})


module.exports = router
