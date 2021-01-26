import { Request, Response } from 'express'
import models from '../models'
import EmailService from '../services/EmailService'

const User = models.User

class ActivitiesNotificationsController {
  public async notify(req: Request, res: Response) {
    var host = process.env.BASE_URL;
    const { email, activity, cropname, firstName, lastName } = req.body
    const user = await User.findOne({ email }).populate('config')
    const name = await User.findOne({ firstName }).populate('config')
    const last = await User.findOne({ lastName }).populate('config')
    await EmailService.send({
      template: 'notification-activity',
      to: user.email,
      data: { name, last, cropname, host},
    })

    res.json({ user })
  }
}

export default new ActivitiesNotificationsController()
