"use strict";

const express = require("express");
const router = express.Router();
const CropsController = require("../controllers/CropsController");

router.get("/", (req, res) => {
  CropsController.index(req.decoded)
    .then(crops => {
      return res.json({ code: 200, error: false, crops });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.put("/:id/budget", (req, res) => {
  CropsController.budget(req.params.id, req.body)
    .then(crop => {
      return res.json({ code: 200, error: false, crop });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.get("/types", async (req, res) => {
  CropsController.types()
    .then(crops => {
      return res.json({ code: 200, error: false, crops });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.post("/", (req, res) => {
  CropsController.create(req.body, req.decoded)
    .then(crop => {
      return res.json({ code: 200, error: false, crop });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.post("/:id/colaborators", (req, res) => {
  CropsController.colaborators(req.params.id, req.body, req.decoded)
    .then(crop => {
      return res.json({ code: 200, error: false, crop });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.post("/:id/confirmation", (req, res) => {
  CropsController.confirmation(req.params.id, req.decoded)
    .then(data => {
      return res.json({ code: 200, error: false, data });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.get("/:id", (req, res) => {
  CropsController.show(req.params.id, req.decoded)
    .then(crop => {
      return res.json({ code: 200, error: false, crop });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.get("/:id/budget/:fields", (req, res) => {
  const { id, fields } = req.params;

  CropsController.getStageCropByField(id, fields)
    .then(budget => {
      if (!budget) {
        return res
          .status(404)
          .json({
            code: 404,
            error: true,
            message: `No se encontró el budget con el nombre del campo ${fields}`
          });
      }

      return res.json({ code: 200, error: false, budget });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.put("/:id", (req, res) => {
  CropsController.update(req.params.id, req.body)
    .then(crop => {
      return res.json({ code: 200, error: false, crop });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.delete("/:id", async (req, res) => {
  CropsController.delete(req.params.id)
    .then(crop => {
      return res.json({ code: 200, error: false, crop });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

module.exports = router;
