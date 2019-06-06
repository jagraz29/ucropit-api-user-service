'use strict'

const express = require("express");
const router = express.Router();
const SignsController = require("../controllers/SignsController");

router.post('/:idCrop/type/:type', async (req, res) => {
  const { idCrop, type } = req.params
    SignsController.sign(idCrop, type, req.decoded)
    .then((fields) => {
      return res.json({ code: 200, error: false, fields })
    }).catch((err) => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    })
})

module.exports = router