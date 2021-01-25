import { Request, Response } from 'express'
import models from '../models'
import EmailService from '../services/EmailService'

const User = models.User

class CollaboratorsNotificationsController {

  public async notify (req: Request, res: Response) {
    console.log("REQ", req.body)
    let user = await User.findOne({ email: req.body.email }).populate('config')
    let cropname = req.body.cropname
    let identifier = req.body.identifier
      console.log('reaching notify controller')
      await EmailService.send({
        template: 'send-code',
        to: user.email,
        data: { user, cropname, identifier }
      })

      res.json({ user })
  }
}

export default new CollaboratorsNotificationsController()
