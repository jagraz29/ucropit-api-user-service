import express from 'express'
import badgesController from '../../controllers/BadgesController'
import {
	createBadgeValidationPolicy,
	updateBadgeValidationPolicy
} from '../../utils'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/badges:
 *  get:
 *   summary: Get Badges
 *   tags:
 *      - Badge
 *   description: Get Badges
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Badges
 */
router.get('/', badgesController.index)

/**
 * @swagger
 * path:
 *  /v1/badges:
 *    post:
 *      summary: Create a new Badge
 *      tags: [Badge]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  type:
 *                     type: string
 *                     required: true
 *                     description: Badge type
 *                  nameEs:
 *                     type: string
 *                     required: true
 *                     description: Badge name spanish
 *                  nameEn:
 *                     type: string
 *                     required: true
 *                     description: Badge name english
 *                  namePt:
 *                     type: string
 *                     required: true
 *                     description: Badge name portuguese
 *                  goalReach:
 *                     type: number
 *                     required: true
 *                     description: Goal reach of Badge
 *                  image:
 *                     type: string
 *                     required: true
 *                     description: Badge url image
 *
 *      responses:
 *       '201':
 *         description: Create a new Badge.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Badge'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', [createBadgeValidationPolicy], badgesController.create)

/**
 * @swagger
 * path:
 *  /v1/badges/{id}:
 *    put:
 *      summary: Update a Badge
 *      tags: [Badge]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  badgeId:
 *                     type: string
 *                     required: true
 *                     description: Badge ID
 *                  type:
 *                     type: string
 *                     description: Badge type
 *                  nameEs:
 *                     type: string
 *                     description: Badge name spanish
 *                  nameEn:
 *                     type: string
 *                     description: Badge name english
 *                  namePt:
 *                     type: string
 *                     description: Badge name portuguese
 *                  goalReach:
 *                     type: number
 *                     description: Goal reach of Badge
 *                  image:
 *                     type: string
 *                     description: Badge url image
 *
 *      responses:
 *       '201':
 *         description: Create a new Badge.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Badge'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id', [updateBadgeValidationPolicy], badgesController.update)

/**
 * @swagger
 * path:
 *  /v1/badges/{id}:
 *    delete:
 *      summary: Delete activity
 *      tags: [Activity]
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
//router.delete('/:id', badgesController.delete)

export default router
