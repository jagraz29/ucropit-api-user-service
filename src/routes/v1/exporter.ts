import express from 'express'

import exporterController from '../../controllers/ExporterController'

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
router.get('/crops', exporterController.cropData)

export default router
