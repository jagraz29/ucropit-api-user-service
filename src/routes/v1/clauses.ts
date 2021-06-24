import express from 'express'
import { ClausesController } from '../../controllers'
import { createClauseValidation,updateClauseValidation  } from '../../middlewares'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/clauses:
 *  get:
 *   summary: Get Clauses
 *   tags:
 *      - Clause
 *   description: Get Clauses
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Clauses
 */
router.get('/', ClausesController.index)

/**
 * @swagger
 * path:
 *  /v1/clauses:
 *    post:
 *      summary: Create a new Clause
 *      tags: [Clause]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  title:
 *                     type: string
 *                     required: true
 *                     description: Clause title
 *                  description:
 *                     type: string
 *                     required: true
 *                     description: Clause name spanish
 *                  image:
 *                     type: string
 *                     description: Clause url image
 *
 *      responses:
 *       '201':
 *         description: Create a new Clause.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Clause'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', [createClauseValidation], ClausesController.create)

/**
 * @swagger
 * path:
 *  /v1/badges/{badgeId}:
 *    put:
 *      summary: Update a Badge
 *      tags: [Badge]
 *      parameters:
 *        - in: path
 *          name: badgeId
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  title:
 *                     type: string
 *                     required: true
 *                     description: Clause title
 *                  description:
 *                     type: string
 *                     required: true
 *                     description: Clause name spanish
 *                  image:
 *                     type: string
 *                     description: Clause url image
 *
 *      responses:
 *       '200':
 *         description: Update a Badge.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Badge'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id', [updateClauseValidation], ClausesController.update)

export default router
