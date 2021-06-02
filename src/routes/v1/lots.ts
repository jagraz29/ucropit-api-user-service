import express from 'express'

import lotsController from '../../controllers/LotsController'

import {
    getLotsPolicy
} from '../../utils'

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
router.get('/', lotsController.index)

/**
 * @swagger
 * path:
 *  /v1/lots/search-by-identifier:
 *    get:
 *      summary: Get all lots grouped by tag
 *      tags: [Lots]
 *      parameters:
 *        - in: query
 *          name: identifier
 *        - in: query
 *          name: dateCrop
 *      responses:
 *        "200":
 *          description: Show success
 *          produces:
 *            - application/json
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/search-by-identifier', [getLotsPolicy], lotsController.searchByIdentifier)
/**
 * @swagger
 * path:
 *  /v1/lots/{id}:
 *    get:
 *      summary: Show a lot
 *      tags: [Lots]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lot'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id', lotsController.show)

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
 *                  names:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["str1", "str2", "str3"]
 *                  tag:
 *                       type: string
 *                       description: Name tag for lots
 *                  files:
 *                       type: array
 *                       items:
 *                          type: string
 *                          format: binary
 *      responses:
 *       '201':
 *         description: List lots persists.
 *         content:
 *          application/json:
 *             schema:
 *               type: array
 *               items:
 *                 schema:
 *                    $ref: '#/components/schemas/Lot'
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', lotsController.create)

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
 *                       type: array
 *                       items:
 *                          type: string
 *                          format: binary
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
router.post('/surfaces', lotsController.surfaces)

/**
 * @swagger
 * path:
 *  /v1/lots/{id}:
 *    put:
 *      summary: Update a lot
 *      tags: [Lots]
 *      parameters:
 *        - in: path
 *          name: id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 surface:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 tag:
 *                   type: string
 *      responses:
 *        "200":
 *          description: A lot schema
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Lot'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.put('/:id', lotsController.update)

/**
 * @swagger
 * path:
 *  /v1/lots/{id}:
 *    delete:
 *      summary: Delete a lot
 *      tags: [Lots]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Delete success
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.delete('/:id', lotsController.delete)

export default router
