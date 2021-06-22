'use strict'

import EmailService from './EmailService'
import models from '../models'

const Notification = models.Notification

interface INotification {
  content: string
  title: string
  userId: string
  data?: any
  read?: boolean
  channel: string
}

class NotificationService {
  static async email (
    template: string,
    user,
    data: any,
    notificationData?: { title: string; content: string }
  ): Promise<void> {
    try {
      await EmailService.send({
        template,
        to: user.email,
        data
      })

      if (notificationData) {
        await NotificationService.store({
          content: notificationData.content,
          title: notificationData.title,
          data,
          channel: 'email',
          userId: user._id
        })
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  static async store (notification: INotification) {
    const newNotification: any = new Notification()

    newNotification.content = notification.content
    newNotification.title = notification.title
    newNotification.userId = notification.userId
    newNotification.data = notification.data || {}
    newNotification.read = false
    newNotification.channel = notification.channel

    await newNotification.save()
  }
}

export default NotificationService
