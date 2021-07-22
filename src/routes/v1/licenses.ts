import express from 'express'
import { LicensesController } from '../../controllers'
import {
  listLicenseByCropTypeValidation,
  licenseByIdValidation,
  checkTokenPinValidation
} from '../../middlewares'

const router: express.Router = express.Router()

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
router.get(
  '/search-by-crop',
  [listLicenseByCropTypeValidation],
  LicensesController.searchByCropType
)

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
router.get('/:id', [licenseByIdValidation], LicensesController.licenseById)

/**
 * @swagger
 *  /v1/licenses/{id}:
 *    get:
 *      summary: Get License by id
 *      tags: [License]
 *      parameters:
 *        - in: path
 *          name: id
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
 *                  userId:
 *                    type: string
 *                    required: true
 *                    description:  user Id
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

export default router
