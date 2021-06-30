import express from 'express'
import { LicensesController } from '../../controllers'
import {
  createLicenseValidate,
  listLicensebyCrptypeValidation,
  licensebyIdValidation
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
  [listLicensebyCrptypeValidation],
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
router.get('/:id', [licensebyIdValidation], LicensesController.licenseById)

export default router
