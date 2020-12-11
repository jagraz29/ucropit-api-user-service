import { Request, Response } from 'express'
import models from '../models'

const Crop = models.Crop

class ExporterController {
  /**
   *
   * @param Request req
   * @param Response res
   */
  public async cropData (req: Request, res: Response) {
    const { ids } = req.query

    const crops = await Crop.find()
      .populate('lots.data')
      .populate('cropType')
      .populate('unitType')
      .populate({
        path: 'done',
        populate: [
          { path: 'type' },
          { path: 'lots' },
          {
            path: 'achievements',
            populate: [{ path: 'lots' }, { path: 'supplies.typeId' }]
          }
        ]
      })
      .populate('members.user')
      .populate({
        path: 'finished',
        populate: [
          { path: 'type' },
          { path: 'lots' },
          {
            path: 'achievements',
            populate: [{ path: 'lots' }, { path: 'supplies.typeId' }]
          }
        ]
      })
      .where('_id')
      .in(ids)
      .lean()

    res.status(200).json(crops)
  }
}

export default new ExporterController()
