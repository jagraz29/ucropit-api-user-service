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

/**
 * @swagger
 * path:
 *  /v1/reports/datasets/crops:
 *    get:
 *      summary: Download dataset to Json file.
 *      tags: [Reports]
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                type: object
 *                properties:
 *                  lot_id:
 *                    type: string
 *                  campaign_id:
 *                    type: string
 *                  coords:
 *                     type: array
 *                     items:
 *                        type: array
 *                        items:
 *                          type: integer
 *                  state:
 *                    type: string
 *                  sowing_surfaces:
 *                     type: array
 *                     items:
 *                        type: string
 *                  sowing_date:
 *                     type: array
 *                     items:
 *                        type: string
 *                  harvest_date:
 *                     type: array
 *                     items:
 *                        type: string
 *                  cropType:
 *                    type: string
 *                  seed_gen:
 *                    type: string
 *                  yield:
 *                    type: string
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/datasets/crops', checkAuth, reportsController.generateDataSet)

router.post(
  '/crops/attachment',
  authMiddleware,
  reportsController.sendFileReport
)

router.get('/map/lot', reportsController.showMap)

export default router
