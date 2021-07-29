import express from 'express'
import { LicensesController } from '../../controllers'
import {
  listLicenseByCropTypeValidation,
  licenseByIdValidation,
  appliedLicensesByCropValidation,
  applyLicenseValidation,
  checkTokenPinValidation
} from '../../middlewares'

const router: express.Router = express.Router()

/**
 * @swagger
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
router.get(
  '/search-by-crop',
  [listLicenseByCropTypeValidation],
  LicensesController.searchByCropType
)

/**
 * @swagger
 *  /v1/licenses/{id}:
 *    get:
 *      summary: Get License by id
 *      tags: [License]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
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
router.get('/:id', [licenseByIdValidation], LicensesController.licenseById)

/**
 * @swagger
 *  /v1/licenses/{id}/sign:
 *    post:
 *      summary: Sign License by id
 *      tags: [License]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  cropId:
 *                    type: string
 *                    required: true
 *                    description:  crop Id
 *                  tokenPin:
 *                    type: string
 *                    required: true
 *                    description:  token Pin
 *      responses:
 *        "200":
 *          description: sign license success
 *          produces:
 *            - application/json
 *        "404":
 *          description: Not Found license
 *        "500":
 *          description: Server error
 */
router.post('/:id/sign', [checkTokenPinValidation], LicensesController.sign)

/**
 * @swagger
 *  /v1/licenses/{id}/applied-by-crop:
 *    get:
 *      summary: Get Applied licenses by crop
 *      tags: [License]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *        - in: query
 *          name: cropId
 *          required: true
 *      responses:
 *        "200":
 *          description: Show success
 *          produces:
 *            - application/json
 *        "400":
 *          description: Bad Request
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get(
  '/:id/applied-by-crop',
  [appliedLicensesByCropValidation],
  LicensesController.searchAppliedLicensesByCrop
)

/**
 * @swagger
 *  /v1/licenses/{id}/apply:
 *    post:
 *      summary: Apply License
 *      tags: [License]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  cropId:
 *                    type: string
 *                    required: true
 *                    description:  crop Id
 *                  companyIdentifier:
 *                    type: string
 *                    required: true
 *                    description:  company identifier
 *                  lots:
 *                    items:
 *                      type: string
 *                    required: true
 *      responses:
 *        "200":
 *          description: apply license success
 *          produces:
 *            - application/json
 *        "400":
 *          description: Bad Request
 *        "404":
 *          description: Not Found license
 *        "500":
 *          description: Server error
 */
router.post('/:id/apply', [applyLicenseValidation], LicensesController.apply)

export default router
