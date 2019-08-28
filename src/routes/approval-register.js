"use strict";

const express = require("express")
const router = express.Router()
const ApprovalsRegisterController = require("../controllers/ApprovalsRegisterController")

router.post('/:approvalId', async (req, res) => {
  try {
    const { approvalId } = req.params
    const register = await ApprovalsRegisterController.create(approvalId)

    return res.json({ code: 200, error: false, register })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

router.post('/:approvalId/complete', async (req, res) => {
  try {
    const { approvalId } = req.params
    const register = await ApprovalsRegisterController.complete(approvalId)

    return res.json({ code: 200, error: false, register })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

router.post('/:approvalId', async (req, res) => {
  try {
    const { approvalId } = req.params
    const register = await ApprovalsRegisterController.create(approvalId)

    return res.json({ code: 200, error: false, register })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

router.get('/register/:id', async (req, res) => {
  try {
    const { id } = req.params
    const register = await ApprovalsRegisterController.showRegister(id)

    return res.json({ code: 200, error: false, register })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

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

router.get('/crops/:idCrop/stages/:stage/:type/:typeId', async (req, res) => {
  try {
    const { idCrop, stage, type, typeId } = req.params
    const register = await ApprovalsRegisterController.show(idCrop, stage, type, typeId)

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

router.post('/:registerId/files', async (req, res) => {
  try {
    const register = await ApprovalsRegisterController.file(
      req.params.registerId,
      req.files,
      req.body.concept
    )

    return res.json({ code: 200, error: false, register })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: error })
  }
})

module.exports = router
