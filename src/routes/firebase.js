"use strict";

const express = require("express");
const router = express.Router();
const FirebaseManagerController = require("../controllers/FirebaseManagerController");

router.post("/connect", (req, res) => {
  FirebaseManagerController.connect(req)
    .then(result => {
      return res.json({ code: 200, error: false, result });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: err.message });
    });
});

router.post("/update", (req, res) => {
  FirebaseManagerController.update(req)
    .then(result => {
      return res.json({ code: 200, error: false, result });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: err.message });
    });
});

router.post("/disconnect", (req, res) => {
  FirebaseManagerController.disconnect(req)
    .then(result => {
      return res.json({ code: 200, error: false, result });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: err.message });
    });
});

module.exports = router;
