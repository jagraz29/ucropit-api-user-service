import express from 'express'

import commonController from '../../controllers/CommonController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/commons/croptypes:
 *  get:
 *   summary: Get all crops types
 *   tags:
 *      - Common
 *   description: Crops
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Crops
 */
router.get('/croptypes', commonController.cropTypes)

/**
 * @swagger
 * /v1/commons/unitypes:
 *  get:
 *   summary: Get all unit types
 *   tags:
 *      - Common
 *   description: Crops
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Crops
 */
router.get('/unitypes', commonController.unitTypes)

export default router
