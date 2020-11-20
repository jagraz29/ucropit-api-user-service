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
 *    post:
 *      summary: Sign Achievement
 *      tags: [Achievement]
 *      parameters:
 *        - in: path
 *          name: id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                  activityId:
 *                    type: string
 *                    required: true
 *                  cropId:
 *                    type: string
 *                    required: true
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
router.post('/:id/signs', achievementsController.signAchievement)

/**
 * @swagger
 * path:
 *  /v1/achievements/activities/{activityId}/crops/{cropId}/pdf:
 *    get:
 *      summary: Download PDF achievements
 *      tags: [Achievement]
 *      parameters:
 *        - in: path
 *          name: activityId
 *        - in: path
 *          name: cropId
 *      produces:
 *        - application/pdf
 *      responses:
 *       '200':
 *          description: OK
 *          schema:
 *            type: file
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.get(
  '/activities/:idActivity/crops/:idCrop/pdf',
  achievementsController.makePdf
)

export default router
