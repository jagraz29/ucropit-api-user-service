import express from 'express'

import reportsController from '../../controllers/ReportsController'

const router: express.Router = express.Router()

router.get('/crops', reportsController.generateCrops)

export default router
