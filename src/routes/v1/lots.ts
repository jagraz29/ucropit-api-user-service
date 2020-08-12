import express from 'express'

import lotController from '../../controllers/LotController'

const router: express.Router = express.Router()

router.post('/surfaces', lotController.surfaces)

export default router
