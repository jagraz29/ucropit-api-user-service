import express from 'express'
import usersController from '../../controllers/UsersController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/collaborators:
 *  get:
 *   summary: Get all collaborator request
 *   tags:
 *      - Collaborators Request
 *   parameters:
 *        - in: query
 *          name: company
 *   description: Collaborators Request
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Crops
 */
router.get('/', usersController.listCollaborators)

/**
 * @swagger
 * path:
 *  /v1/collaborators/{userId}:
 *    put:
 *      summary: Update a crop
 *      tags: [Collaborators Request]
 *      parameters:
 *        - in: path
 *          name: userId
 *      requestBody:
 *        content:
 *        application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: string
 *
 *
 *      responses:
 *       '201':
 *         description: Create success a company.
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/CollaboratorRequest'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:userId', usersController.updateStatusCollaborator)

export default router
