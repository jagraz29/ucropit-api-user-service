"use strict";

const express = require("express");
const router = express.Router();
const ColaboratorController = require("../controllers/ColaboratorController");

router.post("/productions/:cropId/:stage/:fieldId/:type", (req, res) => {
  const { cropId, stage, fieldId, type } = req.params;
  ColaboratorController.create(
    req.body,
    cropId,
    stage,
    fieldId,
    type,
    req.decoded
  )
    .then(result => {
      return res.json({ code: 200, error: false, result });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

module.exports = router;
