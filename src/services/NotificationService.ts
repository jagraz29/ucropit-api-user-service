'use strict'

import EmailService from './EmailService'

class NotificationService {
  static async email (template: string, user, data: any): Promise<void> {
    try {
      await EmailService.send({
        template,
        to: user.email,
        data
      })
    } catch (err) {
      throw new Error(err)
    }
  }
}

export default NotificationService
