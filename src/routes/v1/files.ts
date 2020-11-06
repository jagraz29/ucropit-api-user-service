import express from 'express'

import filesController from '../../controllers/FileController'

const router: express.Router = express.Router()

router.get('/downloads/:id', filesController.download)

export default router
