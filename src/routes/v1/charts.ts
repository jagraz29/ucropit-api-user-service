import express from 'express'
const router: express.Router = express.Router()

import chartsController from '../../controllers/ChartController'

router.get('/surfaces/agreements', chartsController.surfaceActivityAgreement)

router.get('/volumes/tons', chartsController.volumesCrops)

router.get('/summary/crops', chartsController.dataGeneralCrops)

export default router
