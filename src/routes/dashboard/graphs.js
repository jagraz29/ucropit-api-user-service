const express = require('express')
const router = express.Router()

const GraphsController = require('../../controllers/dashboard/GraphsController')

router.get('/surfacePerCrop/:companyId', (req, res) => {
  return GraphsController.surfacePerCrop(req, res)
})

module.exports = router
