import { Request, Response } from 'express'
import models from '../models'
import { generateAuthTokenPin } from '../utils'
import { UserSchema } from '../models/user'
import UserService from '../services/UserService'

const User = models.User

class UsersController {
  public async index(req: Request, res: Response) {
    const users = await User.find({})
    res.status(200).json({ users })
  }

  public async show(req: Request, res: Response) {
    const user = await User.findById(req.params.id)
    res.json({ user })
  }

  public async create(req: Request, res: Response) {
    const user = await UserService.store(req.body)
    res.json(user)
  }

  public async update(req: Request, res: Response) {
    const { email, firstName, lastName, phone, pin } = req.body
    let user: any = await User.findOne({ email: email })

    if (!user) return res.status(404).json({ error: 'ERR_NOT_FOUND' })

    user.firstName = firstName
    user.lastName = lastName
    user.phone = phone

    if (pin) user.pin = pin

    user = await user.save()
    await user.populate('config').populate('collaboratorRequest').execPopulate()
    res.json(user)
  }

  /**
   * Validate PIN user.
   *
   * @param Request | any req
   * @param Response res
   */
  public async validatePin(req: Request | any, res: Response) {
    const { pin } = req.body
    const user: any = await User.findById(req.user._id)

    if (user) {
      user.comparePassword(pin, 'pin', async function (err, isMatch) {
        if (err) res.status(500).json({ error: err.message })

        if (isMatch) {
          const tokenPin = generateAuthTokenPin(req.user._id)
          return res.json({ user, validate: true, tokenPin })
        }

        return res.json({ validate: false })
      })
    } else {
      res.status(404).json({ error: 'ERR_NOT_FOUND' })
    }
  }

  public async destroy(req: Request, res: Response) {
    await User.findByIdAndDelete(req.params.id)
    res.json({
      message: 'deleted successfully'
    })
  }
}

export default new UsersController()
