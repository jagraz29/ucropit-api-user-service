import express from 'express'

import suppliesController from '../../controllers/SuppliesController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/supplies:
 *  get:
 *   summary: Get all supplies
 *   tags:
 *      - Supply
 *   description: Supplies
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Supplies
 */
router.get('/', suppliesController.index)

export default router
