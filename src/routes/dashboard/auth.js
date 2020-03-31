const express = require('express')
const router = express.Router()

const AuthController = require('../../controllers/dashboard/Auth/AuthController')

router.post('/login', (req, res) => {
  AuthController.login(req.body)
    .then((result) => {
      if (result.error) {
        return res
          .status(401)
          .json({ error: true, code: 401, message: result.msg })
      }

      return res.status(200).json({
        error: false,
        code: 200,
        message: 'Success',
        data: {
          user: result.user,
          token: result.token
        }
      })
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).json({ error: true, code: 500, message: error })
    })
})

module.exports = router
