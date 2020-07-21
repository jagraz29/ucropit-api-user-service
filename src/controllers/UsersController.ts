import { Request, Response } from 'express'
import models from '../models'

const User = models.User

class UsersController {
  public static index (req: Request, res: Response) {
    return res.json({ name: 'here' })
  }

  public static async create (req: Request, res: Response) {
    try {
      const user = await User.create(req.body)
      res.json(user)
    } catch (err) {
      res.status(500).json({ err })
    }
  }
}

export default UsersController
