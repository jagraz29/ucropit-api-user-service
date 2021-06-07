import express from 'express'

import companiesController from '../../controllers/CompaniesController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/companies:
 *  get:
 *   summary: Get all companies
 *   tags:
 *      - Companies
 *   parameters:
 *        - in: query
 *          name: identifier
 *   description: Companies
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Crops
 */
router.get('/', companiesController.index)

/**
 * @swagger
 * path:
 *  /v1/companies/{id}:
 *    get:
 *      summary: Get all company's lots
 *      tags: [Companies]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Company'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id', companiesController.show)

/**
 * @swagger
 * path:
 *  /v1/companies/integrations/{id}:
 *    get:
 *      summary: Show a services integration company's
 *      tags: [Companies]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Company'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/integrations/:id', companiesController.showIntegrations)

/**
 * @swagger
 * path:
 *  /v1/companies:
 *    post:
 *      summary: Create a company
 *      tags: [Companies]
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  identifier:
 *                    type: string
 *                    description: CUIT de la empresa
 *                  typePerson:
 *                    type: string
 *                    description: ['Física', 'Jurídica']
 *                  name:
 *                    type: string
 *                    description: Razon social de la empresa
 *                  address:
 *                    type: string
 *                  addressFloor:
 *                    type: string
 *
 *      responses:
 *       '201':
 *         description: Create success a company.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Company'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', companiesController.create)

/**
 * @swagger
 * path:
 *  /v1/companies/{id}:
 *    put:
 *      summary: Update a crop
 *      tags: [Companies]
 *      parameters:
 *        - in: path
 *          name: id
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *              properties:
 *                  identifier:
 *                    type: string
 *                  typePerson:
 *                    type: string
 *                    description: ['Física', 'Jurídica']
 *                  name:
 *                    type: string
 *                    description: Razon social de la empresa
 *                  address:
 *                    type: string
 *                  addressFloor:
 *                    type: string
 *
 *
 *      responses:
 *       '201':
 *         description: Create success a company.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Company'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id', companiesController.update)

/**
 * @swagger
 * path:
 *  /v1/companies/{id}:
 *    delete:
 *      summary: Delete a company
 *      tags: [Companies]
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
router.delete('/:id', companiesController.delete)

/**
 * @swagger
 * path:
 *  /v1/companies/{id}/files/{fileId}:
 *    delete:
 *      summary: Delete file to company
 *      tags: [Companies]
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: path
 *          name: fileId
 *      responses:
 *        "200":
 *          description: deleted file successfully
 *        "404":
 *          description: Not Found File to delete
 *        "500":
 *          description: Server error
 */
router.delete('/:id/files/:fileId', companiesController.removeFile)

export default router
