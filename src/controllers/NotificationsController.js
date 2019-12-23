'use strict'

const User = require('../models').users
const Mail = require('../services/Mail')

class NotificationsController {
  async sendNotificationMail(req) {
    const { data, users, type } = req.body

    if (!users) throw new Error({ error: 'users not given are required' })

    try {
      const users = await User.findAll({ where: { id: users } })

      if (users !== null) {
        const mails = await Mail.send({ template: type, to: users, data })
      }
    } catch(er)
      throw new Error(error);
   }
}