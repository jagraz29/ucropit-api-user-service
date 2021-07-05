import { Request, Response } from 'express'
import models from '../models'
import EmailService from '../services/EmailService'

const User = models.User

class CollaboratorsNotificationsController {
  public async notify(req: Request, res: Response) {
    const host = process.env.BASE_URL

    const { email, identifier, cropname, role } = req.body
    const user = await User.findOne({ email }).populate('config')

    await EmailService.send({
      template: 'notification-collab',
      to: user.email,
      data: { user, cropname, identifier, role, host }
    })

    res.json({ user })
  }
}

export default new CollaboratorsNotificationsController()
