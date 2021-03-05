import express from 'express'

import integrationServiceController from '../../controllers/IntegrationServiceController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/exporters/crops:
 *  get:
 *   summary: Get all data crops by ids array
 *   tags:
 *      - Exporter
 *   parameters:
 *       - in: query
 *         name: ids
 *         description: One or more IDs
 *         required: true
 *         schema:
 *          type: array
 *          items:
 *             type: integer
 *         style: form
 *         explode: false
 *         examples:
 *          oneId:
 *            summary: Example of a single ID
 *            value: [5]   # ?ids=5
 *          multipleIds:
 *            summary: Example of multiple IDs
 *            value: [1, 5, 7]   # ?ids=1,5,7
 *   description: Exporters data
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Data Crops
 */
router.get('/crops', integrationServiceController.cropData)

/**
 * @swagger
 * path:
 *  /v1/exporters/exporters/logs/{id}/{service}:
 *    get:
 *      summary: Detail Log exporter
 *      tags: [Exporter]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *        - in: path
 *          name: service
 *          required: true
 *      responses:
 *        '200':
 *          description: Exporter Successfully.
 *        '500':
 *          description: Error to Server.
 */
router.get('/logs/:cropId/:service', integrationServiceController.detailExport)

/**
 * @swagger
 * path:
 *  /v1/exporters/crops:
 *    post:
 *      summary: Exporter data crop in third party service
 *      tags: [Exporter]
 *      requestBody:
 *         content:
 *           application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  erpAgent:
 *                    type: string
 *                  crops:
 *                    type: array
 *                    items:
 *                       type: object
 *                       properties:
 *                          id:
 *                            type: string
 *      responses:
 *       '200':
 *         description: Exporter Successfully.
 *       '500':
 *         description: Error to Server.
 */
router.post('/crops', integrationServiceController.exporterCrops)

/**
 * @swagger
 * path:
 *  /v1/exporters/crops/{cropId}/activities/{activityId}/achievements/{achievementId}:
 *    post:
 *      summary: Exporter data achievements to third party service
 *      tags: [Exporter]
 *      parameters:
 *        - in: path
 *          name: cropId
 *        - in: path
 *          name: activityId
 *        - in: path
 *          name: achievementId
 *      requestBody:
 *         content:
 *           application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  erpAgent:
 *                    type: string
 *      responses:
 *       '200':
 *         description: Exporter Successfully.
 *       '500':
 *         description: Error to Server.
 */
router.post(
  '/crops/:cropId/activities/:activityId/achievements/:achievementId',
  integrationServiceController.exporterAchievements
)

router.post('/company', integrationServiceController.create)

/**
 *this is crops data for screen
 */
router.get(
  '/cropReport/:cropId',
  integrationServiceController.getCropSyncAchievements
)

export default router
