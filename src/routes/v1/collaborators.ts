import express from 'express'
import collaboratorRequestController from '../../controllers/CollaboratorRequestController'
import CollaboratorsNotificationsController from '../../controllers/CollaboratorsNotificationsController'

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
 *      description: Get all collaborators request
 */
router.get('/', collaboratorRequestController.index)

/**
 * @swagger
 *  /v1/collaborators/{id}:
 *    put:
 *      summary: Update a collaborator request
 *      tags: [Collaborators Request]
 *      parameters:
 *        - in: path
 *          name: id
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: string
 *                    description: ['pending', 'accepted', 'rejected']
 *                  user:
 *                    type: string
 *                    description: Id user
 *                  company:
 *                    type: string
 *                    description: Id company
 *
 *      responses:
 *       '201':
 *         description: Update collaborator Request.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/CollaboratorRequest'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id', collaboratorRequestController.update)

/**
 * @swagger
 * /v1/collaborators/notify:
 *  post:
 *   security: []
 *   summary: send notification email to the newly added collaborator of the crop
 *   tags: [Auth]
 *   description: send notification email to the newly added collaborator of the crop
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            cropname:
 *              type: string
 *            email:
 *              type: string
 *            identifier:
 *              type: string
 *            role:
 *              type: string
 */
router.post('/notify', CollaboratorsNotificationsController.notify)

export default router
