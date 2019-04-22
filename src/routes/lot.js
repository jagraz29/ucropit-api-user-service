"use strict";

const express = require("express");
const router = express.Router();
const LotsController = require("../controllers/LotsController");

router.get('/', async (req, res) => {
  try {
    const lots = await LotsController.index()

    return res.json({ code: 200, error: false, lots })
  } catch (err) {
    console.log(err)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.post('/', async (req, res) => {
  try {
    const lot = await LotsController.create(req.body)

    return res.json({ code: 200, error: false, lot })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const lot = await LotsController.show(req.params.id)

    return res.json({ code: 200, error: false, lot })
  } catch (error) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const lot = await LotsController.update(req.params.id, req.body)
    return res.json({ code: 200, error: false, lot })
  } catch (err) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const lot = await LotsController.delete(req.params.id)
    return res.json({ code: 200, error: false })
  } catch (err) {
    console.log(error)
    return res.json({ code: 400, error: false, data: err })
  }
})

module.exports = router