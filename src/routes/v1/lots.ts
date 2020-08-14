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
router.get('/:id', lotController.show)

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
 *                 schema:
 *                    $ref: '#/components/schemas/Lot'
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', lotController.create)

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
router.put('/:id', lotController.update)

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
router.delete('/:id', lotController.delete)

export default router
