import express from 'express'
import cropCollaboratorsController from '../../controllers/CropCollaboratorsController'
const router: express.Router = express.Router()

/**
 * @swagger
 *  /v1/crops/{id}/collaborators:
 *    post:
 *      summary: Create crop collaborator
 *      tags: [Crop Collaborators]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  identifier:
 *                    type: string
 *                    required: true
 *                  type:
 *                    type: string
 *                    required: true
 *                  email:
 *                    type: string
 *                    required: true
 *
 *      responses:
 *       '200':
 *         description: Create crop collaborator.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/:id/collaborators', cropCollaboratorsController.create)

export default router
