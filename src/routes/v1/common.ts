import express from 'express'

import commonController from '../../controllers/CommonController'

const router: express.Router = express.Router()
/**
 * @swagger
 * /v1/commons/roles:
 *  get:
 *   summary: Get all collaborators roletypes
 *   parameters:
 *      - in: header
 *        name: Accept-Language
 *        type: string
 *        require: true
 *        enum: ['es', 'en', 'pt']
 *   tags:
 *      - Common
 *   description: Collaborator roletypes
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Collaborator roletypes
 */
router.get('/roles', commonController.roles)

/**
 * @swagger
 * /v1/commons/croptypes:
 *  get:
 *   summary: Get all crops types
 *   parameters:
 *      - in: header
 *        name: Accept-Language
 *        type: string
 *        require: true
 *        enum: ['es', 'en', 'pt']
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
 *   parameters:
 *      - in: header
 *        name: Accept-Language
 *        type: string
 *        require: true
 *        enum: ['es', 'en', 'pt']
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
 *   parameters:
 *      - in: header
 *        name: Accept-Language
 *        type: string
 *        require: true
 *        enum: ['es', 'en', 'pt']
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
 *   parameters:
 *      - in: header
 *        name: Accept-Language
 *        type: string
 *        require: true
 *        enum: ['es', 'en', 'pt']
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

/**
 * @swagger
 * /v1/commons/concepts:
 *  get:
 *   summary: Get all evidence concepts
 *   parameters:
 *      - in: header
 *        name: Accept-Language
 *        type: string
 *        require: true
 *        enum: ['es', 'en', 'pt']
 *   tags:
 *      - Common
 *   description: Evidence Concepts
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all evidence concepts
 */
router.get('/concepts', commonController.evidenceConcepts)

/**
 * @swagger
 * /v1/commons/integrations:
 *  get:
 *   summary: Get all services integrations
 *   parameters:
 *      - in: header
 *        name: Accept-Language
 *        type: string
 *        require: true
 *        enum: ['es', 'en', 'pt']
 *   tags:
 *      - Common
 *   description: Services Integration
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all services integrations
 */
router.get('/integrations', commonController.serviceIntegration)

/**
 * @swagger
 * /v1/commons/storagetypes:
 *  get:
 *   summary: Get all storages types
 *   parameters:
 *      - in: header
 *        name: Accept-Language
 *        type: string
 *        require: true
 *        enum: ['es', 'en', 'pt']
 *   tags:
 *      - Common
 *   description: Storage Types
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all services integrations
 */
router.get('/storagetypes', commonController.storageTypes)

/**
 * @swagger
 * /v1/commons/countries:
 *  get:
 *   summary: Get all countries availables
 *   tags:
 *      - Common
 *   description: Countries
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all countries availables
 */
router.get('/countries', commonController.countries)

export default router
