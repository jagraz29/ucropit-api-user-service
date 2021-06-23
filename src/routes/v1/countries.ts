import express from 'express'
import countriesController from '../../controllers/CountriesController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/countries:
 *  get:
 *   summary: Get Countries
 *   tags:
 *      - Country
 *   description: Get Countries
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Countries
 */
router.get('/', countriesController.index)

export default router
