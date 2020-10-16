import { Request, Response } from 'express'
import models from '../models'
import UserService from '../services/UserService'
import EmailService from '../services/EmailService'
import UserConfigService from '../services/UserConfigService'
import numbers from '../utils/Numbers'

const User = models.User

class AuthController {
  public async me (req, res: Response) {
    const user = await User.findOne({ _id: req.user._id }).populate({
      path: 'config',
      populate: [
        { path: 'companySelected' }
      ]
    })
    .populate('companies.company')

    res.json(user)
  }

  public async auth (req: Request, res: Response) {
    let user = await User.findOne({ email: req.body.email })

    if (user) {
      const code = numbers.getRandom()

      user.verifyToken = code
      await user.save()
      await EmailService.send({
        template: 'send-code',
        to: user.email,
        data: { user, code }
      })

      res.json({ user })
    } else {
      res.status(404).json({ error: 'ERR_USER_NOT_FOUND' })
    }
  }

  public async register (req: Request, res: Response) {
    const code = numbers.getRandom()
    const user = await UserService.store({ ...req.body, verifyToken: code })

    await EmailService.send({
      template: 'send-code',
      to: user.email,
      data: { user, code }
    })

    res.json({ user })
  }

  public async validate (req: Request, res: Response) {
    const user = await User.findOne({ email: req.body.email })

    if (user) {
      user.comparePassword(req.body.code, 'verifyToken', async function (
        err,
        isMatch
      ) {
        if (err) res.status(500).json({ error: err.message })

        user.verifyToken = null
        await user.save()

        if (isMatch) {
          const token = user.generateAuthToken()
          res.json({ user, token })
        } else {
          res.status(401).json({ error: 'ERR_CODE_NOT_VALID' })
        }
      })
    } else {
      res.status(404).json({ error: 'ERR_NOT_FOUND' })
    }
  }

  public async pin (req: Request, res: Response) {
    let user = await User.findOne({ email: req.body.email })

    if (!user) return res.status(404).json({ error: 'ERR_NOT_FOUND' })

    user.pin = req.body.pin
    user = await user.save()

    await UserConfigService.update(user.config, { hasPin: true })

    res.json({ user: await user.populate('config').execPopulate() })
  }
}

export default new AuthController()
