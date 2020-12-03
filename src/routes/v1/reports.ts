import express from 'express'

import reportsController from '../../controllers/ReportsController'
import { checkAuth } from '../../utils/auth/BasicAuth'
import passport from '../../utils/auth/strategies/jwt'

const router: express.Router = express.Router()
const authMiddleware = passport.authenticate('jwt', { session: false })

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

router.post(
  '/crops/attachment',
  authMiddleware,
  reportsController.sendFileReport
)

router.get('/map/lot', reportsController.showMap)

export default router
