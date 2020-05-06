const express = require('express')
const router = express.Router()

const ProfileController = require('../../controllers/dashboard/Auth/ProfileController')

router.get('/me', (req, res) => {
  const { user } = req.decoded

  ProfileController.index(user)
    .then((result) => {
      if (result.error)
        return res
          .status(401)
          .json({ error: true, code: 401, message: result.msg })
      return res.status(200).json({
        error: false,
        code: 200,
        message: 'Success',
        data: result.user
      })
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).json({ error: true, code: 500, message: error })
    })
})

module.exports = router
