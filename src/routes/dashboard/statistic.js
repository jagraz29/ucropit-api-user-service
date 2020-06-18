/* global logger */
const express = require('express')
const router = express.Router()

const DashboardController = require('../../controllers/dashboard/DashboardController')

router.get('/states/companies/:companyId', (req, res) => {
  const { companyId } = req.params

  DashboardController.statusCompany(companyId)
    .then((result) => {
      console.log(result)
      return res.status(200).json({ error: false, code: 200, result })
    })
    .catch((error) => {
      logger.log({
        level: 'error',
        message: error.message,
        Date: new Date()
      })
      return res.status(500).json({ error: true, code: 500, message: error })
    })
})

router.get('/states/companies/:companyId/crops/:cropId', (req, res) => {
  const { companyId, cropId } = req.params

  DashboardController.statusCropByCompanyCrop(cropId, companyId)
    .then((result) => {
      res.status(200).json({ error: false, code: 200, result })
    })
    .catch((error) => {
      logger.log({
        level: 'error',
        message: error.message,
        Date: new Date()
      })
      return res.status(500).json({ error: true, code: 500, message: error })
    })
})

router.get('/sign/:companyId/:cropTypeId*?', (req, res) => {
  const { companyId, cropTypeId } = req.params

  DashboardController.statisticSings(companyId, cropTypeId)
    .then((result) => {
      console.log(result)
      res.status(200).json({ error: false, code: 200, result })
    })
    .catch((error) => {
      console.log(error)
      logger.log({
        level: 'error',
        message: error.message,
        Date: new Date()
      })
      return res.status(500).json({ error: true, code: 500, message: error })
    })
})

module.exports = router
