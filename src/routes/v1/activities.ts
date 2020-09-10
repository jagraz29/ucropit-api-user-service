import express from 'express'

import activitiesController from '../../controllers/ActivitiesController'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/activities:
 *  get:
 *   summary: Get all activities
 *   tags:
 *      - Activity
 *   parameters:
 *        - in: query
 *          name: crop
 *          description: ID del crop
 *   description: Activities
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Activities
 */
router.get('/', activitiesController.index)

/**
 * @swagger
 * path:
 *  /v1/activities/{id}:
 *    get:
 *      summary: Show a activity
 *      tags: [Activity]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Activity'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id', activitiesController.show)

/**
 * @swagger
 * path:
 *  /v1/activities:
 *    post:
 *      summary: Create a new Activity
 *      tags: [Activity]
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
 *                  documents:
 *                       type: string
 *                       format: binary
 *                       required: false
 *                       description: Documents File
 *
 *      responses:
 *       '201':
 *         description: Create a new Activity.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/Activity'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', activitiesController.store)

/**
 * @swagger
 * path:
 *  /v1/activities/{id}:
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
router.delete('/:id', activitiesController.delete)

export default router
