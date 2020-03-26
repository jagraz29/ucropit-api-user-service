const express = require('express')
const router = express.Router()

const DashboardController = require('../../controllers/dashboard/DashboardController')

router.get('/:userId', (req, res) => {
  const { userId } = req.params
  DashboardController.index(userId)
    .then((result) => res.json({ code: 200, error: false, result }))
    .catch((error) => res.json({ code: 400, error: true, data: error }))
})

module.exports = router
