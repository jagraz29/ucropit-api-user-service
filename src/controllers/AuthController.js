"use strict"

const User = require('../models').users
const Mail = require('../services/Mail')
const uuid = require('uuid/v1')
const Producer = require("../models").producers

class AuthController {
  static async login({ email, password }) {
    try {
      const user = await User.findOne({
        where: { email: email }
      });

      if (user === null) throw Error(`Credenciales invalidas`);

      if (!user.first_login)
        throw Error(
          `Si fue invitado a colaborar de una campaña debe registrarse`
        );

      const isValidPassword = await user.validPassword(password);

      if (!isValidPassword) throw Error(`Credenciales invalidas`);

      return { user, error: false };
    } catch (err) {
      return { error: true, message: err.message };
    }
  }

  static async register(data) {
    try {
      let user = null;

      const activationToken = uuid()

      user = await User.findOne({
        where: { email: data.email }
      })

      if (user && !user.first_login) {
        await Mail.sendNotificationMail({
          data: {
            user: user,
            activationToken
          },
          usersID: [user.id],
          type: 'user_activation',
          activation_token: activationToken
        })

        return { user: await user.update({ ...data, first_login: 1, active: 0 }), withoutFirstCrop: true }
      }

      if (user !== null) throw Error('El email ya fue tomado')

      const newUser = await User.create({ ...data, active: 0, activation_token: activationToken })
      await Mail.sendNotificationMail({
        data: {
          user: newUser,
          activationToken
        },
        usersID: [newUser.id],
        type: 'user_activation'
      })
      return { user: newUser, withoutFirstCrop: true }

    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async activate(token) {
    try {
      const user = await User.findOne({ where: { activation_token: token } })
      if (user !== null) {
        await user.update({ active: 1 })
        return { success: true }
      } else {
        return { success: false }
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  static async adminLogin({ email, password }) {
    try {
      const user = await User.findOne({
        where: { email: email }
      });

      if (user === null) throw Error(`Credenciales invalidas`);

      const isValidPassword = await user.validPassword(password);

      if (!isValidPassword) throw Error(`Credenciales invalidas`);

      return { user, error: false };
    } catch (err) {
      console.error(err)
      return { error: true, message: err.message };
    }
  }

  static async createUser(data) {
    try {
      const user = await User.create(data);
      await Producer.create({
        ...data,
        user_id: user.id
      });

      return await User.findOne({
        where: { id: user.id },
        include: [{ model: Producer }]
      });

    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = AuthController;