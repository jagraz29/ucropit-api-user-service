import express from 'express'

import suppliesController from '../../controllers/SuppliesController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/supplies:
 *  get:
 *   summary: Get all supplies list
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

/**
 * @swagger
 * /v1/supplies/quantities:
 *  get:
 *   summary: Get total documents supplies
 *   tags:
 *      - Supply
 *   description: Supplies
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get numbers of documents save in supplies collection
 */
router.get('/quantities', suppliesController.quantity)

export default router
