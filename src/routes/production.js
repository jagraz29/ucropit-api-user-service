'use strict'

const express = require('express')
const router = express.Router()
const ProductionController = require('../controllers/ProductionController')

router.post('/:idCrop/generate', async (req, res) => {
  ProductionController.generate(req.params.idCrop)
    .then((data) => {
      return res.status(200).json({ code: 200, error: false, data })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.get('/:idCrop', async (req, res) => {
  ProductionController.index(req.params.idCrop, req.decoded)
    .then((productions) => {
      return res.status(200).json({ code: 200, error: false, productions })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.post('/:idCrop/stages/:stage', async (req, res) => {
  ProductionController.storeStageData(req.params.idCrop, req.params.stage, req.body)
    .then((production) => {
      return res.status(200).json({ code: 200, error: false, production })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.post('/:idCrop/monitoring/add', async (req, res) => {
  ProductionController.addMonitoring(req.params.idCrop, req.params.stage, req.body)
    .then((production) => {
      return res.status(200).json({ code: 200, error: false, production })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.post('/:idCrop/other-expenses/add', async (req, res) => {
  ProductionController.addOtherExpenses(req.params.idCrop, req.params.stage, req.body)
    .then((production) => {
      return res.status(200).json({ code: 200, error: false, production })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})


router.post('/:idCrop/fields', async (req, res) => {
  ProductionController.storeField(req.params.idCrop, req.body, req.decoded)
    .then((field) => {
      return res.status(200).json({ code: 200, error: false, field })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.put("/:idCrop/:stage/:fieldId/:type", async (req, res) => {
  ProductionController.updateData(req)
    .then((data) => {
      return res.status(200).json({ code: 200, error: false, data })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.put("/permission/:idCrop/:stage/:fieldId/:type", async (req, res) => {
  console.log(req.params);
});

router.put("/done/stage/:idCrop/stages/:stage", async(req, res) => {
  ProductionController.updateStatusStage(req)
    .then((data) => {
      return res.status(200).json({ code: 200, error: false, data })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.delete('/:idCrop/:stage/:fieldId/:type', async (req, res) => {
  ProductionController.deleteAplicationStage(req.params.idCrop, req.params.stage, req.params.fieldId, req.params.type)
    .then((field) => {
      return res.status(200).json({ code: 200, error: false, field })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

module.exports = router
