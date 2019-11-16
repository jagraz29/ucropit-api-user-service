"use strict";

const express = require("express");
const router = express.Router();
const FieldsController = require("../controllers/FieldsController");

router.get('/', async (req, res) => {
  FieldsController.index(req.decoded)
    .then((fields) => {
      return res.json({ code: 200, error: false, fields })
    }).catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.post('/', (req, res) => {
  FieldsController.create(req.body, req.decoded, req.files)
    .then(data => {
      return res.json({ code: 200, error: false, data })
    })
    .catch(err => {
      return res.status(500).json({ code: 500, err: true, message: err.message })
    })
})

router.get('/:id', async (req, res) => {
  FieldsController.show(req.params.id)
    .then((field) => {
      return res.json({ code: 200, error: false, field })
    }).catch(err => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

router.put('/:id', async (req, res) => {
  FieldsController.update(req.params.id, req.body, req.files).then(field => {
    return res.json({ code: 200, error: false, field })
  }).catch(err => {
    return res.status(500).json({ code: 500, error: true, message: err.message })
  })
})

router.delete('/:id', async (req, res) => {
  FieldsController.delete(req.params.id).then(data => {
    return res.json({ code: 200, error: false })
  }).catch(err => {
    return res.status(500).json({ code: 500, error: true, message: err.message })
  })
})

module.exports = router