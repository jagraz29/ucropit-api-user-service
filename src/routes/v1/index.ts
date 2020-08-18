import express from 'express'
import 'express-async-errors'
import users from './users'
import auth from './auth'
import lost from './lots'

const router: express.Router = express.Router()

router.get('/', (req, res) => {
  res.send('v1 APP OK')
})

router.use('/auth', auth)

router.use('/users', users)

router.use('/lots', lost)

export default router
