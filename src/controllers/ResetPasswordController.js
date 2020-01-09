'use strict'

const User = require('../models').users
const uuid = require('uuid/v1')
const Mail = require('../services/Mail')

class ResetPassword {
  static async reset (token, password) {
    try {
      const user = await User.findOne({ where: { reset_token: token } })

      if (!user) {
        throw new Error('El código de validacion caduco o es invalido')
      }

      await user.update({ password, reset_token: null })

      return { user }
    } catch (err) {
      throw new Error(err)
    }
  }

  static async request (email) {
    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        throw new Error('El usuario no existe en nuestros registros')
      }

      const token = uuid()

      await user.update({ reset_token: token })

      await Mail.sendNotificationMail({
        data: { token, user },
        usersID: [user.id],
        type: 'password_reset'
      })

      return { user }
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = ResetPassword
