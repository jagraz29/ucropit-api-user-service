import express from 'express'
import authController from '../../controllers/AuthController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/auth:
 *  post:
 *   summary: Auth a user
 *   tags: [Auth]
 *   description: Auth a user
 *   responses:
 *     '200':
 *        description: Auth a user
 *     '404':
 *        description: Email user doesn't exists
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            email:
 *              type: string
 */
router.post('/', authController.auth)

/**
 * @swagger
 * /v1/auth/register:
 *  post:
 *   summary: Register a user
 *   tags: [Auth]
 *   description: Register a user
 *   responses:
 *     '200':
 *        description: Register a user
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            email:
 *              type: string
 *            phone:
 *              type: string
 */
router.post('/register', authController.register)

/**
 * @swagger
 * /v1/auth/validate:
 *  post:
 *   summary: Validate user
 *   tags: [Auth]
 *   description: Validate user
 *   responses:
 *     '200':
 *        description: User validated
 *     '401':
 *        description: Invalid code
 *     '404':
 *        description: User not found
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            code:
 *              type: string
 *            email:
 *              type: string
 */
router.post('/validate', authController.validate)

/**
 * @swagger
 * /v1/auth/pin:
 *  post:
 *   summary: Store pin
 *   tags: [Auth]
 *   description: Store pin
 *   responses:
 *     '200':
 *        description: Pin saved
 *     '404':
 *        description: User not found
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            pin:
 *              type: string
 *            email:
 *              type: string
 */
router.post('/pin', authController.pin)

export default router
