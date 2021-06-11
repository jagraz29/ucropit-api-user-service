import express from 'express'

import cropsController from '../../controllers/CropsController'
import {
  cropStorePolicy,
  hasKmzInFilesPolicy,
  hasLotsOrReusableLotsInDataPolicy,
  validateDateCropAndDateHarvestInData
} from '../../utils'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/crops:
 *  get:
 *   summary: Get all crops
 *   tags:
 *      - Crops
 *   description: Crops
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all Crops
 */
router.get('/', cropsController.index)

/**
 * @swagger
 * path:
 *  /v1/crops/lastMonitoring/{id}:
 *    get:
 *      summary: Show lastMonitoring
 *      tags: [Activity]
 *      parameters:
 *        - in: path
 *          name: id
 */
router.get('/lastMonitoring/:id', cropsController.showLastMonitoring)

/**
 * @swagger
 * path:
 *  /v1/crops/{id}:
 *    get:
 *      summary: Show a crop
 *      tags: [Crops]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id', cropsController.show)

/**
 * @swagger
 * path:
 *  /v1/crops/{id}/v2:
 *    get:
 *      summary: Show a crop and Lots
 *      tags: [Crops]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id/v2', cropsController.getCropWithLots)

/**
 * @swagger
 * path:
 *  /v1/crops/{id}/evidences:
 *    get:
 *      summary: Show a crop's evidences
 *      tags: [Crops]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id/evidences', cropsController.evidences)

router.get('/:nameFile/pdf-history-crop', cropsController.pdfHistoryCrop)

/**
 * @swagger
 * path:
 *  /v1/crops/{id}/crop-history/pdf:
 *    post:
 *      summary: Show a crop
 *      tags: [Crops]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.post('/:id/crop-history/pdf', cropsController.generatePdfHistoryCrop)

/**
 * @swagger
 * path:
 *  /v1/crops/{id}/activities:
 *    get:
 *      summary: Show a crop
 *      tags: [Crops]
 *      parameters:
 *        - in: path
 *          name: id
 *      responses:
 *        "200":
 *          description: Show success
 *          content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id/activities', cropsController.getCropWithActivities)

/**
 * @swagger
 * path:
 *  /v1/crops:
 *    post:
 *      summary: Create a crop
 *      tags: [Crops]
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  name:
 *                    type: string
 *                  pay:
 *                    type: number
 *                    format: double
 *                  surface:
 *                    type: number
 *                    format: double
 *                  dateCrop:
 *                    type: string
 *                    format: date
 *                    description: 2020-05-01
 *                  dateHarvest:
 *                    type: string
 *                    format: date
 *                    description: 2020-05-01
 *                  cropType:
 *                    type: string
 *                  lots:
 *                    items:
 *                      type: object
 *                      properties:
 *                        names:
 *                          items:
 *                            type: string
 *                        tag:
 *                           type: string
 *                  reusableLots:
 *                    items:
 *                      type: object
 *                      properties:
 *                        lotIds:
 *                          items:
 *                            type: string
 *                        tag:
 *                           type: string
 *                  unitType:
 *                    type: string
 *                  company:
 *                    type: object
 *                    properties:
 *                         identifier:
 *                            type: string
 *                         typePerson:
 *                            type: string
 *                         name:
 *                            type: string
 *                         address:
 *                            type: string
 *                         addressFloor:
 *                            type: string
 *
 *
 *      responses:
 *       '201':
 *         description: Create success a crop.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', [
  cropStorePolicy,
  validateDateCropAndDateHarvestInData,
  hasLotsOrReusableLotsInDataPolicy,
  hasKmzInFilesPolicy
], cropsController.create)

/**
 * @swagger
 * path:
 *  /v1/crops/offline/{id}:
 *    put:
 *      summary: Update a crop
 *      tags: [Crops]
 *      parameters:
 *        - in: path
 *          name: id
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  downloaded:
 *                    type: boolean
 *      responses:
 *       '201':
 *         description: Create success a crop.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/offline/:id', cropsController.enableOffline)

/**
 * @swagger
 * path:
 *  /v1/crops/{id}:
 *    put:
 *      summary: Update a crop
 *      tags: [Crops]
 *      parameters:
 *        - in: path
 *          name: id
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  name:
 *                    type: string
 *                  pay:
 *                    type: number
 *                    format: double
 *                  surface:
 *                    type: number
 *                    format: double
 *                  dateCrop:
 *                    type: string
 *                    format: date
 *                    description: 2020-05-01
 *                  dateHarvest:
 *                    type: string
 *                    format: date
 *                    description: 2020-05-01
 *                  cropType:
 *                    type: string
 *                  unitType:
 *                    type: string
 *                  lots:
 *                    type: object
 *                    properties:
 *                         names:
 *                            items:
 *                              type: string
 *                         tag:
 *                           type: string
 *
 *
 *      responses:
 *       '201':
 *         description: Create success a crop.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id', cropsController.update)

/**
 * @swagger
 * path:
 *  /v1/crops/{id}/integrations:
 *    put:
 *      summary: Update a crop add integration service
 *      tags: [Crops]
 *      parameters:
 *        - in: path
 *          name: id
 *      requestBody:
 *        content:
 *          application/json:
 *              schema:
 *               type: object
 *               properties:
 *                  service:
 *                    type: string
 *      responses:
 *       '201':
 *         description: Update success a crop.
 *         content:
 *            application/json:
 *             schema:
 *                $ref: '#/components/schemas/Crop'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.put('/:id/integrations', cropsController.addIntegrationService)

/**
 * @swagger
 * path:
 *  /v1/crops/{id}:
 *    delete:
 *      summary: Delete a crop
 *      tags: [Crops]
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
router.delete('/:id', cropsController.delete)

export default router
