import express from 'express'
import webHookController from '../../controllers/WebHookController'
const router: express.Router = express.Router()

/**
 * @swagger
 * path:
 *  /v1/offline/crops?identifier={identifier}:
 *    post:
 *      summary: Reset sync of crop
 *      tags: [Offline]
 *      responses:
 *        "200":
 *          description: Show success
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.post('/sensing/callback', webHookController.sensingSatelliteCallback)

export default router
