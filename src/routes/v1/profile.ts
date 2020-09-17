import express from 'express'

import profileController from '../../controllers/ProfileController'

const router: express.Router = express.Router()

/**
 * @swagger
 * path:
 *  /v1/profile/{id}/image:
 *    get:
 *      summary: Store a image
 *      tags: [Profile]
 *      parameters:
 *        - in: path
 *          name: id
 *        - in: formData
 *          name: file
 *          type: file
 *      produces:
 *        - multipart/form-data
 *      responses:
 *        "200":
 *          description: Show success
 *        "404":
 *          description: Not Found Resources
 *        "500":
 *          description: Server error
 */
router.get('/:id/image', profileController.image)

export default router
