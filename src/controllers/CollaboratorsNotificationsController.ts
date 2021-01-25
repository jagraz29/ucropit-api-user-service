import { Request, Response } from 'express'
import models from '../models'
import EmailService from '../services/EmailService'

const User = models.User

class CollaboratorsNotificationsController {
  public async notify(req: Request, res: Response) {
    const { email, identifier, cropname } = req.body
    const user = await User.findOne({ email }).populate('config')
    await EmailService.send({
      template: 'send-code',
      to: user.email,
      data: { user, cropname, identifier },
    })

    res.json({ user })
  }
}

export default new CollaboratorsNotificationsController()
