/* global logger */
const express = require('express')
const router = express.Router()

const GraphsController = require('../../controllers/dashboard/GraphsController')

router.get('/surfacePerCrop/:companyId', (req, res) => {
  return GraphsController.surfacePerCrop(req, res)
})

router.get('/signatures/companies/:companyId/:cropTypeId?', (req, res) => {
  const { companyId, cropTypeId } = req.params
  GraphsController.percentSignature(companyId, cropTypeId)
    .then((result) => {
      res.status(200).json({ result, error: false })
    })
    .catch((error) => {
      logger.log({
        level: 'error',
        message: error.message,
        Date: new Date()
      })
      res.status(500).json({ error: true, message: error })
    })
})

router.get(
  '/registers/companies/:companyId/croptypes/:cropTypeId?',
  (req, res) => {
    const { companyId, cropTypeId } = req.params
    GraphsController.cantRegisterPerStage(companyId, cropTypeId)
      .then((result) => {
        res.status(200).json({ result, error: false })
      })
      .catch((error) => {
        logger.log({
          level: 'error',
          message: error.message,
          Date: new Date()
        })
        res.status(500).json({ error: true, message: error })
      })
  }
)

router.get('/signatures/companies/:companyId/croptypes', (req, res) => {
  const { companyId } = req.params

  GraphsController.percentSignaturePerCropType(companyId)
    .then((result) => {
      res.status(200).json({ result, error: false })
    })
    .catch((error) => {
      logger.log({
        level: 'error',
        message: error.message,
        Date: new Date()
      })
      res.status(500).json({ error: true, message: error })
    })
})

module.exports = router
