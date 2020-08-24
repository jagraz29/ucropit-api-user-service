import express from 'express'
import 'express-async-errors'
import users from './users'
import auth from './auth'
import lost from './lots'
import crop from './crop'
import company from './company'
import common from './common'

const router: express.Router = express.Router()

router.get('/', (req, res) => {
  res.send('v1 APP OK')
})

router.use('/auth', auth)

router.use('/users', users)

router.use('/lots', lost)

router.use('/commons', common)

router.use('/crops', crop)

router.use('/companies', company)

export default router
