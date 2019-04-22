const User = require('../models').User

const jwt = require('jsonwebtoken');

class AuthController {
    static getToken(user) {
        return jwt.sign(user, process.env.JWT_SECRET)
    }

    static async register(data) {

        const user = await User.create(data)

        const token = await AuthController.getToken({ user })
        return { user, token }
    }

}

module.exports = AuthController