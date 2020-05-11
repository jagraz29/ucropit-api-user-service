'use strict'

const ProfileService = require('../../../services/dashboard/auth/ProfileService')

class ProfileController {
  static async index(user) {
    try {
      const result = await ProfileService.profile(user)

      if (result.error) return { error: result.error, msg: result.msg }

      return { user: result, error: false }
    } catch (error) {
      console.log(`Error del controlador Profile: ${error}`)
      return { error: true, msg: `${error.message}` }
    }
  }
}

module.exports = ProfileController
