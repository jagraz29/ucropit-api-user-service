import express from 'express'
import badgesController from '../../controllers/BadgesController'
import {
  createBadgeValidationPolicy,
  updateBadgeValidationPolicy,
  deleteBadgeValidationPolicy
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
 *  /v1/badges/{badgeId}:
 *    put:
 *      summary: Update a Badge
 *      tags: [Badge]
 *      parameters:
 *        - in: path
 *          name: badgeId
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
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
 *         description: Update a Badge.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Badge'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:badgeId', [updateBadgeValidationPolicy], badgesController.update)

/**
 * @swagger
 * path:
 *  /v1/badges/{badgeId}:
 *    delete:
 *      summary: Delete a Badge
 *      tags: [Badge]
 *      parameters:
 *        - in: path
 *          name: badgeId
 *
 *      responses:
 *       '201':
 *         description: Delete a Badge.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Badge'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.delete(
  '/:badgeId',
  [deleteBadgeValidationPolicy],
  badgesController.delete
)

export default router
