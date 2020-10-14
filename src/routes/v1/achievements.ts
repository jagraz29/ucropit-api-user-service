import express from 'express'
import achievementsController from '../../controllers/AchievementsController'

const router: express.Router = express.Router()

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

export default router
