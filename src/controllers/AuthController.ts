/* tslint:disable:await-promise */
import { Request, Response } from 'express'
import models from '../models'
import UserService from '../services/UserService'
import EmailService from '../services/EmailService'
import UserConfigService from '../services/UserConfigService'
import { Numbers } from '../utils'

const User = models.User
const ForeignCredential = models.ForeignCredential

class AuthController {
  public async me(req, res: Response) {
    const { id } = req.user
    const user = await UserConfigService.findUserWithConfigs(id)

    res.json(user)
  }

  public async auth(req: Request, res: Response) {
    const user: any = await User.findOne({
      email: req.body.email.toLocaleLowerCase()
    }).populate('config')

    if (user && user.config?.fromInvitation && !user.firstName) {
      return res.status(404).json({ error: 'ERR_USER_NOT_FOUND' })
    }

    if (user) {
      if (user.isInactive) {
        return res.status(403).json({ error: 'ERR_USER_INACTIVE' })
      }

      const code = Numbers.getRandom()

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

  public async register(req: Request, res: Response) {
    const { firstName, lastName, email, phone } = req.body
    let user: any = await User.findOne({
      email: req.body.email.toLocaleLowerCase()
    }).populate('config')

    const code = Numbers.getRandom()

    if (user && user.config.fromInvitation && !user.firstName) {
      user.firstName = firstName
      user.lastName = lastName
      user.email = email.toLowerCase()
      user.phone = phone
      user.verifyToken = code
      user = await user.save()
    } else {
      user = await UserService.store({ ...req.body, verifyToken: code })
    }

    await EmailService.send({
      template: 'send-code',
      to: user.email,
      data: { user, code }
    })

    res.json({ user })
  }

  public async validate(req: Request, res: Response) {
    const user: any = await User.findOne({
      email: req.body.email.toLocaleLowerCase()
    })

    if (user) {
      user.comparePassword(
        req.body.code,
        'verifyToken',
        async function (err, isMatch) {
          if (err) res.status(500).json({ error: err.message })

          if (isMatch) {
            user.verifyToken = null
            await user.save()
            const token = user.generateAuthToken()
            res.json({ user, token })
          } else {
            res.status(401).json({ error: 'ERR_CODE_NOT_VALID' })
          }
        }
      )
    } else {
      res.status(404).json({ error: 'ERR_NOT_FOUND' })
    }
  }

  public async pin(req: Request, res: Response) {
    let user = await User.findOne({ email: req.body.email })

    if (!user) return res.status(404).json({ error: 'ERR_NOT_FOUND' })

    user.pin = req.body.pin
    user = await user.save()

    await UserConfigService.update(user.config, { hasPin: true })

    const responseUser = await UserConfigService.findUserWithConfigs(user._id)

    res.json({ user: responseUser })
  }

  public async authForeignService(req: Request, res: Response) {
    const { credentialKey, credentialSecret } = req.body

    const credential: any = await ForeignCredential.findOne({ credentialKey })

    if (!credential) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND' })
    }

    credential.comparePassword(
      credentialSecret,
      'credentialSecret',
      async function (err, isMatch) {
        if (err) res.status(500).json({ error: err.message })

        if (isMatch) {
          const token = credential.generateAuthToken()
          res.json({ token })
        } else {
          res.status(401).json({ error: 'NOT_MATCH_VALID' })
        }
      }
    )
  }
}

export default new AuthController()
