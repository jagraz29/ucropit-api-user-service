"use strict";

const User = require("../models").users;

class AuthController {

  static async login({ email, password }) {
    try {
      const user = await User.findOne({
        where: { email: email }
      })

      if (user === null) throw Error(`Credenciales invalidas`)

      if (!user.first_login) throw Error(`Si fue invitado a colaborar de una campaña debe registrarse`)

      const isValidPassword = await user.validPassword(password)

      if (!isValidPassword) throw Error(`Credenciales invalidas`)

      return { user, error: false }

    } catch (err) {
      return { error: true, message: err.message }
    }
  }

  static async register(data) {
    try {
      const user = await User.findOne({
        where: { email: data.email }
      })

      if (user && !user.first_login) {
        return { user: await user.update({ ...data, first_login: 1 }), withoutFirstCrop: true }
      }

      if (user !== null) throw Error('El email ya fue tomado')

      return { user: await User.create(data), withoutFirstCrop: false }

    } catch (err) {
      console.log(err)
      return null
    }
  }
}

module.exports = AuthController