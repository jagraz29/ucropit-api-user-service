import express from 'express'
import webHookController from '../../controllers/WebHookController'
const router: express.Router = express.Router()

router.post('/sensing/callback', webHookController.sensingSatelliteCallback)

export default router
