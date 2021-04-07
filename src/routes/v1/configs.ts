import express from 'express'
import configsController from '../../controllers/ConfigsController'
const router: express.Router = express.Router()

/**
 * @swagger
 * path:
 *  /v1/configurations/{id}:
 *    put:
 *      summary: Update configuration
 *      tags: [Configs]
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
 *                  companySelected:
 *                    type: string
 *                    required: true
 *                    description: ID de la compañia seleccionada
 *
 *      responses:
 *       '200':
 *         description: Update UserConfig.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserConfig'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id', configsController.update)

/**
 * @swagger
 * path:
 *  /v1/configurations/{id}/companies:
 *    put:
 *      summary: Update configuration and selected company into companies user.
 *      tags: [Configs]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *        - in: query
 *          name: identifier
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  companySelected:
 *                    type: string
 *                    required: true
 *                    description: ID de la compañia seleccionada
 *
 *      responses:
 *       '200':
 *         description: Update UserConfig.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserConfig'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id/companies', configsController.updateSelectedCompany)

export default router
