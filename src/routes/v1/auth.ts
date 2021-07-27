import express from 'express'
import authController from '../../controllers/AuthController'
import passport from '../../utils/auth/strategies/jwt'

const router: express.Router = express.Router()

/**
 * @swagger
 *  /v1/auth/me:
 *    get:
 *      summary: Show authenticated user
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: Show success
 */
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  authController.me
)

/**
 * @swagger
 * /v1/auth:
 *  post:
 *   security: []
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
 *   security: []
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
 *   security: []
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
 *   security:
 *   - bearerAuth: []
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
router.post(
  '/pin',
  passport.authenticate('jwt', { session: false }),
  authController.pin
)

/**
 * @swagger
 * /v1/auth/foreign:
 *  post:
 *   security: []
 *   summary: Auth foreign services
 *   tags: [Auth]
 *   description: Auth a foreign services
 *   responses:
 *     '200':
 *        description: token success authenticate
 *     '404':
 *        description: credentials doesn't exists
 *   requestBody:
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *            credentialKey:
 *              type: string
 *            credentialSecret:
 *              type: string
 */
router.post('/foreign', authController.authForeignService)

export default router
