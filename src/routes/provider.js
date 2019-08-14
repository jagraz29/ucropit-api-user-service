"use strict";

const express = require("express");
const router = express.Router();
const UploadFile = require("../services/UploadFiles");
const ProviderController = require("../controllers/ProviderController");

router.get("/", (req, res) => {
  const { page = 0, pageSize = 10 } = req.query;

  ProviderController.index(page, pageSize)
    .then(providers => {
      return res.json({ code: 200, error: false, providers });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  ProviderController.show(id)
    .then(provider => {
      if (!provider) {
        return res.status(404).json({
          code: 404,
          error: true,
          message: "El recurso no existe"
        });
      }
      return res.json({ code: 200, error: false, provider });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});
router.post("/", (req, res) => {
  const data = req.body;

  ProviderController.create(data)
    .then(provider => {
      return res.status(201).json({ code: 201, error: false, provider });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.put("/:id", (req, res) => {
  const data = req.body;
  const id = req.params.id;

  ProviderController.update(data, id)
    .then(provider => {
      return res.json({ code: 200, error: false, provider });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  ProviderController.delete(id)
    .then(provider => {
      return res.json({ code: 200, error: false, provider });
    })
    .then(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.post("/upload", async (req, res) => {
  const upload = new UploadFile(req.files, "providers");
  upload
    .store()
    .then(result => {
      return res.json({ code: 200, error: false, result });
    })
    .catch(error => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: error.message });
    });
});

module.exports = router;
