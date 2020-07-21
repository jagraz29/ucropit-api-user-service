import express from 'express'
import 'express-async-errors'
import users from './users'

const router: express.Router = express.Router()

/**
 * @swagger
 * /v1:
 *  get:
 *   description: Test endpoint
 *   produces:
 *     - application/json
 *   responses:
 *    '200':
 *      description: A status of API
 */
router.get('/', (req, res) => {
  res.send('v1 APP OK')
})

router.use('/users', users)

export default router
