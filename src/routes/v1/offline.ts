import express from 'express'

import offlineCropsController from '../../controllers/OfflineCropsController'

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
router.post('/crops/reset', offlineCropsController.reset)

export default router
