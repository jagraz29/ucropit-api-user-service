const express = require('express')
const router = express.Router()

const DashboardController = require('../../controllers/dashboard/DashboardController')

router.get('/sign/:companyId/:cropTypeId*?', (req, res) => {
  const { companyId, cropTypeId } = req.params

  DashboardController.statisticSings(companyId, cropTypeId)
    .then((result) => {
        res.json(result)
    })
    .catch((error) => {
        console.log(error)
    })
})

module.exports = router
