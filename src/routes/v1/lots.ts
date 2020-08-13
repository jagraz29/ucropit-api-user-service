import express from 'express'

import lotController from '../../controllers/LotController'

const router: express.Router = express.Router()

router.post('/', lotController.store)

/**
 * @swagger
 * path:
 *  /v1/lots/surfaces:
 *    post:
 *      summary: Get names of areas by given kmz/kml file
 *      tags: [Lots]
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *              schema:
 *               type: object
 *               properties:
 *                  files:
 *                       type: string
 *                       format: binary
 *      responses:
 *       '200':
 *         description: List names and areas to lost kmz or kml file.
 *         content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: Name of lot.
 *                 surface:
 *                   type: string
 *                   description: Surface of lot.
 *                 area:
 *                   type: double
 *                   description: Area of lot.
 *
 *       '500':
 *         description: Error to Server.
 *
 */
router.post('/surfaces', lotController.surfaces)

export default router
