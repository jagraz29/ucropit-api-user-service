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

/**
 * @swagger
 * /v1/commons/activities:
 *  get:
 *   summary: Get all activities types
 *   tags:
 *      - Common
 *   description: Activities types
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all activities types
 */
router.get('/activities', commonController.activitiesTypes)

/**
 * @swagger
 * /v1/commons/agreements:
 *  get:
 *   summary: Get all agreement types
 *   tags:
 *      - Common
 *   description: Agreement Types
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all agreement types
 */
router.get('/agreements', commonController.agreementTypes)

export default router