import express from 'express'
import 'express-async-errors'
import users from './users'
import auth from './auth'
import lots from './lots'
import crop from './crop'
import activities from './activities'
import company from './company'
import common from './common'
import passport from '../../utils/auth/strategies/jwt'

const router: express.Router = express.Router()

router.get('/', (req, res) => {
  res.send('v1 APP OK')
})

const authMiddleware = passport.authenticate('jwt', { session: false })

// AUTH
router.use('/auth', auth)

// USERS
router.use('/users', authMiddleware, users)

// LOTS
router.use('/lots', authMiddleware, lots)

// COMMON
router.use('/commons', authMiddleware, common)

// CROPS
router.use('/crops', authMiddleware, crop)

// ACTIVITIES
router.use('/activities', authMiddleware, activities)

// COMPANIES
router.use('/companies', authMiddleware, company)

export default router
