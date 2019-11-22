"use strict";

const express = require("express");
const router = express.Router();
const ConceptsController = require("../controllers/ConceptsController");

router.get("/", (req, res) => {
  const { page = 0, perPage = 10 } = req.query;
  ConceptsController.inputsPaginate(page, perPage)
    .then(result => {
      return res.json({ code: 200, error: false, result });
    })
    .catch(error => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: error.message });
    });
});

router.get("/:id/:type", (req, res) => {
  ConceptsController.show(req.params.id, req.params.type)
    .then(result => {
      return res.status(200).json({ code: 200, error: false, result });
    })
    .catch(error => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: error.message });
    });
});

router.get("/input-types", (req, res) => {
  ConceptsController.inputTypesWithAttribute()
    .then(result => {
      return res.json({ code: 200, error: false, result });
    })
    .catch(error => {
      return res
        .status(500)
        .json({ code, error: true, message: error.message });
    });
});

router.post("/", (req, res) => {
  const data = req.body;
  ConceptsController.store(data)
    .then(result => {
      return res.status(201).json({ code: 201, error: false, result });
    })
    .catch(error => {
      return res
        .status(500)
        .json({ code, error: true, message: error.message });
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;

  ConceptsController.update(id, data)
    .then(result => {
      return res.status(200).json({ code: 200, error: false, result });
    })
    .catch(error => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: error.message });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  ConceptsController.delete(id)
    .then(result => {
      return res.status(200).json({ code: 200, error: false, result });
    })
    .catch(error => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: error.message });
    });
});

module.exports = router;
