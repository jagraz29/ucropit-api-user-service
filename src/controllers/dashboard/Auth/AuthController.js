'use strict'

const AuthService = require('../../../services/dashboard/AuthServices')

class AuthController {
  static async login({ email, password }) {
    try {
      const result = await AuthService.auth(email, password)

      if (result.error) return { error: result.error, msg: result.msg }

      return { user: result.user.toJSON(), token: result.token, error: false }
    } catch (err) {
      return { error: true, message: err.message }
    }
  }
}

module.exports = AuthController
