const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const token = req.header('Authorization')
  if (!token) return res.status(401).send('Access denied. Token required')

  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(400).send('Invalid token')
  }
}