"use strict";

const express = require("express")
const router = express.Router()
const ApprovalsController = require("../controllers/ApprovalsController")

router.post('/', async (req, res) => {
  try {
    const approval = await ApprovalsController.create(req.body)

    return res.json({ code: 200, error: false, approval })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

router.get('/crops/:cropId/stages/:stage', async (req, res) => {
  try {
    const approval = await ApprovalsController.index(req.params)
    return res.json({ code: 200, error: false, approval })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

router.get('/crops/:cropId/stages/:stage/type/:type/:typeId', async (req, res) => {
  try {
    const approval = await ApprovalsController.show(req.params)

    return res.json({ code: 200, error: false, approval })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

module.exports = router
