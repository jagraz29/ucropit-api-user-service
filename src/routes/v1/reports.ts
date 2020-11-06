import express from 'express'

import reportsController from '../../controllers/ReportsController'
import { checkAuth } from '../../utils/auth/BasicAuth'

const router: express.Router = express.Router()

/**
 * @swagger
 * path:
 *  /v1/reports/crops:
 *    get:
 *      summary: Download reports
 *      tags: [Reports]
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/crops', checkAuth, reportsController.generateCrops)

router.get('/map/lot', reportsController.showMap)

export default router
