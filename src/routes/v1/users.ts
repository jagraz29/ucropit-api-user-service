import express from 'express'
import usersController from '../../controllers/UsersController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/users:
 *  get:
 *   summary: Get all users
 *   tags:
 *      - Users
 *   description: Users
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all users
 */
router.get('/', usersController.index)

/**
 * @swagger
 * path:
 *  /v1/users/{id}:
 *    get:
 *      summary: Show a user
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 */
router.get('/:id', usersController.show)

/**
 * @swagger
 * path:
 *  /v1/users:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.post('/', usersController.create)

/**
 * @swagger
 * path:
 *  /v1/users/{id}:
 *    put:
 *      summary: Update a user
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.put('/:id', usersController.update)

/**
 * @swagger
 * path:
 *  /v1/users/{id}:
 *    delete:
 *      summary: Delete a user
 *      tags: [Users]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Delete success
 */
router.delete('/:id', usersController.destroy)

export default router
