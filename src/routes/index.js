const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/auth')

router.use('/api/auth', require('./auth'))
router.use('/api/reset', require('./reset'))
router.use('/api/crops', authMiddleware.checkToken, require('./crop'))
router.use('/api/fields', authMiddleware.checkToken, require('./field'))
router.use('/api/concepts', authMiddleware.checkToken, require('./concept'))
router.use('/api/lots', require('./lot'))
router.use('/api/uploads', require('./upload'))
router.use('/api/signs', authMiddleware.checkToken, require('./sign'))
router.use('/api/files', require('./upload'))
router.use('/api/firebase', authMiddleware.checkToken, require('./firebase'))
router.use('/api/providers', authMiddleware.checkToken, require('./provider'))
router.use('/api/supplies', require('./supplies'))
router.use(
  '/api/productions',
  authMiddleware.checkToken,
  require('./production')
)
router.use(
  '/api/applications',
  authMiddleware.checkToken,
  require('./applications')
)
router.use('/api/approvals', authMiddleware.checkToken, require('./approval'))
router.use('/api/approvals/registers', authMiddleware.checkToken, require('./approval-register'))
router.use('/api/contacts', authMiddleware.checkToken, require('./contacts'))
router.use(
  '/api/colaborators',
  authMiddleware.checkToken,
  require('./colaborator')
)
router.use(
  '/api/notifications',
  authMiddleware.checkToken,
  require('./notifications')
)
router.use(
  '/api/users',
  require('./users')
)

module.exports = router
