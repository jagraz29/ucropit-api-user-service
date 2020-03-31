'use strict'

const User = require('../../models').users
const jwt = require('jsonwebtoken')
const Company = require('../../models').companies
const CompanyUserProfile = require('../../models').companies_users_profiles

const createToken = async (user) =>
  jwt.sign({ user }, process.env.JWT_SECRET_DASHBOARD)

class AuthService {
  /**
   * Authenticate users to Dashboard.
   *
   * @param {*} email
   * @param {*} password
   */
  static async auth(email, password) {
    console.log('here')
    try {
      const user = await User.findOne({
        where: { email: email },
        include: [
          {
            model: Company,
            through: {
              model: CompanyUserProfile
            }
          }
        ]
      })

      if (user === null) {
        return { user: null, error: true, msg: 'Credenciales invalidas' }
      }

      const isValidPassword = await user.validPassword(password)

      if (!isValidPassword) {
        return { user: null, error: true, msg: 'Credenciales invalidas' }
      }

      const token = await this.token(user)

      return { user, error: false, token }
    } catch (error) {
      return {
        user: false,
        error: true,
        msg: `ERROR DE SERVIDOR: ${error.message}`
      }
    }
  }

  /**
   * Create Token Login.
   *
   * @param {*} user
   */
  static async token(user) {
    try {
      return await createToken(user)
    } catch (error) {
      console.log(`Error al crear el token: ${error.message}`)
      return null
    }
  }
}

module.exports = AuthService
