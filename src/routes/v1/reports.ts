import express from 'express'

import reportsController from '../../controllers/ReportsController'
import { checkAuth } from '../../utils/auth/BasicAuth'

const router: express.Router = express.Router()

router.get('/crops', checkAuth, reportsController.generateCrops)

router.get('/map/lot', reportsController.showMap)

export default router
