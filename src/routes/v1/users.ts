import express from 'express'
import UsersController from '../../controllers/UsersController'

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
router.get('/', UsersController.index)

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
router.post('/', UsersController.create)

export default router
