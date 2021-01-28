import { Request, Response } from 'express'
import models from '../models'
import UploadService from '../services/UploadService'
import ImageService from '../services/ImageService'

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
  public async image(req: Request, res: Response) {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND' })
    }

    const fileSaved = await UploadService.upload(
      req.files,
      `profile/${user._id}`
    )

    let thumbnailImages = fileSaved.map(async (file) => {
      const thumbnail = await ImageService.createThumbnail({
        path: file.path,
        destination: `${process.env.DIR_UPLOADS}/profile`,
        nameFile: file.nameFile,
        suffixName: 'thumbnail',
        width: 200,
        height: 200,
        fit: 'cover',
      })

      return thumbnail
    })

    thumbnailImages = await Promise.all(thumbnailImages)

    user.avatar = thumbnailImages[0].path

    await user.save()

    res.status(200).json(user)
  }
}

export default new ProfileController()
