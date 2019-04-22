"use strict";

const express = require("express");
const router = express.Router();
const FieldsController = require("../controllers/FieldsController");

router.get('/', async (req, res) => {
  try {
    const fields = await FieldsController.index()

    return res.json({ code: 200, error: false, fields })
  } catch (err) {
    console.log(err)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.post('/', async (req, res) => {
  try {
    const field = await FieldsController.create(req.body)

    return res.json({ code: 200, error: false, field })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const field = await FieldsController.show(req.params.id)

    return res.json({ code: 200, error: false, field })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const field = await FieldsController.update(req.params.id, req.body)
    return res.json({ code: 200, error: false, field })
  } catch (err) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const field = await FieldsController.delete(req.params.id)
    return res.json({ code: 200, error: false })
  } catch (err) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

module.exports = router