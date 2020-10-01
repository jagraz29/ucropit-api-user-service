import { Request, Response } from 'express'
import models from '../models'
import UploadService from '../services/UploadService'

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
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND' })
    }

    const fileSaved = await UploadService.upload(
      req.files,
      `profile/${user._id}`
    )

    user.avatar = fileSaved[0].path

    await user.save()

    res.status(200).json(user)
  }
}

export default new ProfileController()
