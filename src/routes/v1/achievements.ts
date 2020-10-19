import express from 'express'
import achievementsController from '../../controllers/AchievementsController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/achievements:
 *  get:
 *   summary: Get all achievements
 *   tags:
 *      - Achievement
 *   parameters:
 *        - in: query
 *          name: activityId
 *          description: ID de la actividad
 *   description: Achievements
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all achievements
 */
router.get('/', achievementsController.index)

/**
 * @swagger
 * path:
 *  /v1/achievements/{id}:
 *    get:
 *      summary: Show a achievement
 *      tags: [Achievement]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Achievement'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id', achievementsController.show)

/**
 * @swagger
 * path:
 *  /v1/achievements:
 *    post:
 *      summary: Create a new Achievement
 *      tags: [Achievement]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  data:
 *                     type: string
 *                     required: true
 *                     description: Data in JSON to convert in String
 *                  files:
 *                       type: string
 *                       format: binary
 *                       required: false
 *                       description: Documents File
 *
 *      responses:
 *       '201':
 *         description: Create a new Achievement.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Achievement'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', achievementsController.create)

/**
 * @swagger
 * path:
 *  /v1/achievements/{id}/signs:
 *    put:
 *      summary: Sign Achievement
 *      tags: [Achievement]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *       '200':
 *         description: Sign Achievement.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Achievement'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id/signs', achievementsController.signAchievement)

export default router
