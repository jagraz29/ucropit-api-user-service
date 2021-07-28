import express from 'express'

import reportsController from '../../controllers/ReportsController'
import { checkAuth } from '../../utils/auth/BasicAuth'
import passport from '../../utils/auth/strategies/jwt'

const router: express.Router = express.Router()
const authMiddleware = passport.authenticate('jwt', { session: false })

/**
 * @swagger
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
router.get('/datasets/crops', reportsController.generateDataSet)

router.post(
  '/crops/attachment',
  authMiddleware,
  reportsController.sendFileReport
)

/**
 * @swagger
 *  /v1/reports/validations/companies:
 *    post:
 *      summary: Request send email with report the crops of company.
 *      tags: [Reports]
 *      parameters:
 *        - in: query
 *          name: identifier
 *          required: true
 *          schema:
 *            type: string
 *        - in: query
 *          name: email
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: ok
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.post(
  '/validations/companies',
  // authMiddleware,
  reportsController.reportsSignersByCompanies
)

/**
 * @swagger
 *  /v1/reports/eiq:
 *    post:
 *      summary: Request send email with report with the eiq of supplies.
 *      tags: [Reports]
 *      parameters:
 *        - in: query
 *          name: identifier
 *          required: true
 *          schema:
 *            type: string
 *        - in: query
 *          name: email
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: ok
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.post('/eiq', reportsController.reportsEiq)

/**
 * @swagger
 *  /v1/reports/dm:
 *    post:
 *      summary: Request send email with DM report.
 *      tags: [Reports]
 *      parameters:
 *        - in: query
 *          name: identifier
 *          required: true
 *          schema:
 *            type: string
 *        - in: query
 *          name: email
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: ok
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.post('/dm', reportsController.reportsDm)

/**
 * @swagger
 *  /v1/reports/xls-for-eiq:
 *    post:
 *      summary: Request send email with xls for eiq report.
 *      tags: [Reports]
 *      parameters:
 *        - in: query
 *          name: email
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: ok
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.post('/xls-for-eiq', reportsController.reportsXlsForEiq)

/**
 * @swagger
 *  /v1/reports/billing:
 *    post:
 *      summary: Request send email with DM report.
 *      tags: [Reports]
 *      parameters:
 *        - in: query
 *          name: identifier
 *          required: true
 *          schema:
 *            type: string
 *        - in: query
 *          name: email
 *          required: true
 *          schema:
 *            type: string
 *        - in: query
 *          name: typeActivity
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        "200":
 *          description: ok
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.post('/billing', authMiddleware, reportsController.sendFileReportBilling)

router.get('/map/lot', reportsController.showMap)

export default router
