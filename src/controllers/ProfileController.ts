import { Request, Response } from 'express'
import models from '../models'

const User = models.User

class ProfileController {
  /**
   * Store profile image.
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async image (req: Request, res: Response) {
    const users = await User.find({ email: req.body.email })

    console.log(req.files)

    res.status(200).json(users)
  }
}

export default new ProfileController()
