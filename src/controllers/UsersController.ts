import { Request, Response } from 'express'
import models from '../models'
import UserService from '../services/UserService'

const User = models.User

class UsersController {
  public async index (req: Request, res: Response) {
    const users = await User.find({})
    res.status(200).json({ users })
  }

  public async show (req: Request, res: Response) {
    const user = await User.findById(req.params.id)
    res.json({ user })
  }

  public async create (req: Request, res: Response) {
    const user = await UserService.store(req.body)
    res.json(user)
  }

  public async update (req: Request, res: Response) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    if (!user) {
      res.status(404).json({ error: 'ERR_NOT_FOUND' })
    } else {
      res.json(user)
    }
  }

  public async destroy (req: Request, res: Response) {
    const user = await User.findByIdAndDelete(req.params.id)
    res.json({
      message: 'deleted successfully'
    })
  }
}

export default new UsersController()
