import { Request, Response } from 'express'
import models from '../models'

const User = models.User

class UsersController {
  public static async index (req: Request, res: Response) {
    const users = await User.find({})
    res.status(200).json({ users })
  }

  public static async show (req: Request, res: Response) {
    const user = await User.findById(req.params.id)
    res.json({ user })
  }

  public static async create (req: Request, res: Response) {
    const user = await User.create(req.body)
    res.json(user)
  }

  public static async update (req: Request, res: Response) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    res.json(user)
  }

  public static async destroy (req: Request, res: Response) {
    const user = await User.findByIdAndDelete(req.params.id)
    res.json({
      message: 'deleted successfully'
    })
  }
}

export default UsersController
