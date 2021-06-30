import { Request, Response } from 'express'
import models from '../models'
import EmailService from '../services/EmailService'

const User = models.User

class ActivitiesNotificationsController {
  public async notify(req: Request, res: Response) {
    const host = process.env.BASE_URL
    const { email, activity, cropname, name } = req.body
    const user = await User.findOne({ email }).populate('config')

    await EmailService.send({
      template: 'notification-activity',
      to: user.email,
      data: { name, activity, cropName: cropname, host }
    })

    res.json({ user })
  }
}

export default new ActivitiesNotificationsController()
