'use strict'

const express = require('express')
const router = express.Router()
const FieldsController = require('../controllers/FieldsController')

router.get('/', async (req, res) => {
  FieldsController.index(req.decoded)
    .then((fields) => {
      return res.json({ code: 200, error: false, fields })
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: err.message })
    })
})

router.get('/all', async (req, res) => {
  FieldsController.indexAll(req.decoded)
    .then((fields) => {
      return res.json({ code: 200, error: false, fields })
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: err.message })
    })
})

router.post('/', (req, res) => {
  FieldsController.create(req.body, req.decoded, req.files)
    .then((data) => {
      if (data.error)
        return res.json({
          code: 400,
          error: true,
          message: data.message,
        })

      return res.json({ code: 200, error: false, field: data.field })
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ code: 500, err: true, message: err.message })
    })
})

router.get('/:id', async (req, res) => {
  FieldsController.show(req.params.id)
    .then((field) => {
      return res.json({ code: 200, error: false, field })
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: err.message })
    })
})

router.put('/:id', async (req, res) => {
  FieldsController.update(req.params.id, req.body, req.files)
    .then((field) => {
      return res.json({ code: 200, error: false, field })
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: err.message })
    })
})

router.delete('/:id', async (req, res) => {
  FieldsController.delete(req.params.id)
    .then((data) => {
      return res.json({ code: 200, error: false })
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: err.message })
    })
})

router.post('/files/parser', async (req, res) => {
  FieldsController.parseFile(req.files)
    .then((result) => {
      if (result)
        return res.status(200).json({ result, error: false, code: 200 })

      return res
        .status(400)
        .json({ error: true, message: 'No se pudo leer el archivo' })
    })
    .catch((error) => {
      console.log(error)
      return res
        .status(500)
        .json({ code: 500, error: true, message: error.message })
    })
})

module.exports = router
