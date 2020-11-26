import { Request, Response } from 'express'

import CropService from '../services/CropService'
import models from '../models'
import { UserSchema } from '../models/user'

const Crop = models.Crop

class ChartController {
  /**
   *
   * @param req
   * @param res
   */
  public async index (req, res: Response) {
    const query: any = {
      cancelled: false,
      'members.user': req.user._id
    }

    if (req.query.identifier) {
      query['members.identifier'] = req.query.identifier
    }

    const crops = await Crop.find(query)
      .populate('cropType')
      .populate('unitType')
      .populate('members.user')
      .populate({
        path: 'finished',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' }
        ]
      })
      .lean()

    CropService.createDataCropToChart(crops)
  }
}

export default new ChartController()
