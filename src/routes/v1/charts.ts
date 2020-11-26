import express from 'express'
const router: express.Router = express.Router()

import chartsController from '../../controllers/ChartController'

router.get('/', chartsController.index)

export default router
