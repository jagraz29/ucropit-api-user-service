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
  ProductionController.index(req.params.idCrop)
    .then((production) => {
      return res.status(200).json({ code: 200, error: false, production })
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

router.post('/:idCrop/fields', async (req, res) => {
  ProductionController.storeField(req.params.idCrop, req.body, req.decoded)
    .then((field) => {
      return res.status(200).json({ code: 200, error: false, field })
    })
    .catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

module.exports = router
