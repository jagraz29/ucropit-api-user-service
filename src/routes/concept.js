'use strict';

const express = require('express');
const router = express.Router();
const ConceptsController = require('../controllers/ConceptsController');

router.get('/', (req, res) => {
  ConceptsController.index()
    .then(concepts => {
      return res.json({ code: 200, error: false, concepts });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.get('/inputs', (req, res) => {
  ConceptsController.input()
    .then(concepts => {
      return res.json({ code: 200, error: false, concepts });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.get('/:id/:type', (req, res) => {
  const { id, type } = req.params;
  ConceptsController.show(id, type)
    .then(concepts => {
      return res.json({ code: 200, error: false, concepts });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.get('/input-types', (req, res) => {
  ConceptsController.inputTypes()
    .then(types => {
      return res.json({ code: 200, error: false, types });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

router.get('/search', (req, res) => {
  const { name } = req.query;
  if (name == '')
    return res
      .status(400)
      .json({
        code: 400,
        error: true,
        message: 'No puede ser vacio el valor name'
      });
  ConceptsController.searchInpuType(name)
    .then(results => {
      return res.json({ code: 200, error: false, results });
    })
    .catch(err => {
      return res
        .status(400)
        .json({ code: 400, error: true, message: err.message });
    });
});

module.exports = router;
