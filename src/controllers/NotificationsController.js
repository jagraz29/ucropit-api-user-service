'use strict'

const Mail = require('../services/Mail')

class NotificationsController {
  async sendNotificationMail (body) {
    const { data } = body

    if (!data) throw new Error({ error: 'data not given are required' })

    try {
      await Mail.sendNotificationMail({
        data,
        usersID: data.usersID,
        type: data.type
      })

      return { message: 'success' }
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = NotificationsController
