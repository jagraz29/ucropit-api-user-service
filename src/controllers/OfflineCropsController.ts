'use strict'

import { Request, Response } from 'express'
import models from '../models'

const Crop = models.Crop

class OfflineCropsController {
  /**
   *
   * Get all crops.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async reset (req: Request | any, res: Response) {
    const userId: string = req.user._id.toString()
    const identifier: string = req.query.identifier

    const crops = await Crop.updateMany(
      {
        'members.identifier': identifier,
        'members.user': userId
      },
      { $set: { downloaded: false } }
    )

    res.status(200).json(crops)
  }
}

export default new OfflineCropsController()
