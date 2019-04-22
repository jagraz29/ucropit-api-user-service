"use strict";

const User = require("../models").users;

class AuthController {

  static async login({ email, password }) {
    try {
      const user = await User.findOne({
        where: { email: email }
      })

      if (user === null) throw Error(`the user with mail ${email} dont exists`)

      const isValidPassword = await user.validPassword(password)

      if (!isValidPassword) throw Error(`invalid password`)

      return user

    } catch (err) {
      console.log(err)
      return null
    }
  }


  static async register(data) {
    try {
      const user = await User.findOne({
        where: { email: data.email }
      })

      if (user !== null) throw Error('the user already exists')

      return await User.create(data)

    } catch (err) {
      console.log(err)
      return null
    }
  }
}

module.exports = AuthController