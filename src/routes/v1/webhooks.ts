import express from 'express'
import webHookController from '../../controllers/WebHookController'
const router: express.Router = express.Router()

/**
 * @swagger
 * path:
 *  /v1/webhooks/sensing/callback:
 *    post:
 *      summary: Reset sync of crop
 *      tags: [WebHooks]
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  status_ok:
 *                    type: boolean
 *                    description: Status Response
 *                  lotId:
 *                    type: string
 *                    description: ID Lot
 *                  description:
 *                    type: string
 *                    required: false
 *                    description: Only pass when not found satellite images
 *                  customOptions:
 *                    type: object
 *                    required: false
 *                    properties:
 *                          activityId:
 *                            type: string
 *                            description: ID Activity
 *                  images:
 *                     type: array
 *                     items:
 *                          type: object
 *                          properties:
 *                              nameFile:
 *                                type: string
 *                                description: Name file satellite image
 *                              date:
 *                                 type: string
 *                                 format: date
 *                                 description: 2020-05-01
 *                              type:
 *                                 type: string
 *                                 description: RGB or NDVI
 *      responses:
 *        "200":
 *          description: Show Ok
 *        "500":
 *          description: Server error
 */
router.post('/sensing/callback', webHookController.sensingSatelliteCallback)

export default router
