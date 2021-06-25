import express from 'express'
import {LicensesController} from '../../controllers'
import { createLicenseValidate, listLicensebyCrptypeValidation, licensebyIdValidation  } from '../../middlewares'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1/license:
 *  get:
 *   summary: Get License
 *   tags:
 *      - Badge
 *   description: Get License
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: Get all License
 */
router.get('/', LicensesController.index)

/**
 * @swagger
 * path:
 *  /v1/licenses/{id}:
 *    get:
 *      summary: Get License by id
 *      tags: [License]
 *      responses:
 *        "200":
 *          description: Show success
 *          produces:
 *            - application/json
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
 router.get('/:id', [licensebyIdValidation], LicensesController.licensebyId)

/**
 * @swagger
 * path:
 *  /v1/licenses/search-by-crop:
 *    get:
 *      summary: Get all License grouped by crop Type
 *      tags: [License]
 *      parameters:
 *        - in: query
 *          name: cropId
 *      responses:
 *        "200":
 *          description: Show success
 *          produces:
 *            - application/json
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
 router.get('/search-by-crop', [listLicensebyCrptypeValidation], LicensesController.searchByCropType)

/**
 * @swagger
 * path:
 *  /v1/license:
 *    post:
 *      summary: Create a new License
 *      tags: [License]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  type:
 *                     type: string
 *                     required: true
 *                     description: License type
 *                  name:
 *                     type: string
 *                     required: true
 *                     description: License name
 *                  previewDescription:
 *                     type: string
 *                     required: true
 *                     description: preview Description
 *                  companyId:
 *                     type: string
 *                     required: true
 *                     description: id company
 *                  termsAndConditions:
 *                     type: string
 *                     required: true
 *                     description: termins And Conditions License
 *                  cropType:
 *                     type: string
 *                     required: true
 *                     description: type crop
 *                  clauses:
 *                     type: array
 *                     items:
 *                          type: object
 *                          properties:
 *                              title:
 *                                type: string
 *                                description: title clause
 *                              description:
 *                                 type: string
 *                                 description: description clause
 *                              image:
 *                                 type: string
 *                                 description: image clause
 *                  accessibleIdentifier:
 *                     type: array
 *                     items:
 *                         type: string
 *                     	   required: true
 *                     	   description: accessible Identifier
 *                  startDate:
 *                     type: string
 *                     required: true
 *                     format: date
 *                     description: 2020-05-01
 *                  endDate:
 *                     type: string
 *                     required: true
 *                     format: date
 *                     description: 2020-05-01
 *                  startDatePost:
 *                     type: string
 *                     required: true
 *                     format: date
 *                     description: 2020-05-01
 *                  endDatePost:
 *                     type: string
 *                     required: true
 *                     format: date
 *                     description: 2020-05-01
 *                  companyUsers:
 *                     type: array
 *                     items:
 *                         type: string
 *                     	   required: true
 *                     	   description: company Users
 *                  status:
 *                     type: string
 *                     required: true
 *                     description: License status
 *                  hectareLimit:
 *                     type: number
 *                     required: true
 *                     description: License hectare Limit
 *                  timeLeftPost:
 *                     type: number
 *                     required: true
 *                     description: License time Left Post
 *                  timeLeftNew:
 *                     type: number
 *                     required: true
 *                     description: License time Left New
 *                  hectareLeftPercentage:
 *                     type: number
 *                     required: true
 *                     description: License hectare Left Percentage
 *                  image:
 *                     type: string
 *                     description: License image
 *
 *      responses:
 *       '201':
 *         description: Create a new License.
 *         content:
 *         application/json:
 *             schema:
 *                $ref: '#/components/schemas/License'
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/', [createLicenseValidate], LicensesController.create)

export default router
