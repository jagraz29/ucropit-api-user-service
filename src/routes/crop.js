"use strict";

const express = require("express");
const router = express.Router();
const CropsController = require("../controllers/CropsController");

router.get('/', async (req, res) => {
  try {
    const crops = await CropsController.index()

    return res.json({ code: 200, error: false, crops })
  } catch (err) {
    console.log(err)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.get('/types', async (req, res) => {
  try {
    const crops = await CropsController.types()

    return res.json({ code: 200, error: false, crops })
  } catch (err) {
    console.log(err)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.post('/', async (req, res) => {
  try {
    const crop = await CropsController.create(req.body)

    return res.json({ code: 200, error: false, crop })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const crop = await CropsController.show(req.params.id)

    return res.json({ code: 200, error: false, crop })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const crop = await CropsController.update(req.params.id, req.body)
    return res.json({ code: 200, error: false, crop })
  } catch (err) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const crop = await CropsController.delete(req.params.id)
    return res.json({ code: 200, error: false })
  } catch (err) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

module.exports = router