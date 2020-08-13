import express from 'express'

import lotController from '../../controllers/LotController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/lots:
 *  get:
 *   summary: Get all lots
 *   tags:
 *      - Lots
 *   description: Lots
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all lots
 */
router.get('/', lotController.index)

/**
 * @swagger
 * path:
 *  /v1/lots:
 *    post:
 *      summary: Store Lot
 *      tags: [Lots]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  selectedLots:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["str1", "str2", "str3"]
 *                  tag:
 *                       type: string
 *                       description: Name tag for lots
 *                  files:
 *                       type: string
 *                       format: binary
 *      responses:
 *       '201':
 *         description: List lots persists.
 *         content:
 *          application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lot'
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', lotController.store)

/**
 * @swagger
 * path:
 *  /v1/lots/surfaces:
 *    post:
 *      summary: Get names of areas by given kmz/kml file
 *      tags: [Lots]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  files:
 *                       type: string
 *                       format: binary
 *      responses:
 *       '200':
 *         description: List names and areas to lost kmz or kml file.
 *         content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of lot.
 *                 surface:
 *                   type: string
 *                   description: Surface of lot.
 *                 area:
 *                   type: double
 *                   description: Area of lot.
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/surfaces', lotController.surfaces)

export default router
