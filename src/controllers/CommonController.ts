import { Request, Response } from 'express'
import models from '../models'

const CropType = models.CropType
const UnitType = models.UnitType

class CommonController {
  /**
   *
   * Get all crops types.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async cropTypes (req: Request, res: Response) {
    const cropTypes = await CropType.find({})

    res.status(200).json(cropTypes)
  }

  /**
   * Get all unit types
   *
   * @param req
   * @param res
   *
   *  @return Response
   */
  public async unitTypes (req: Request, res: Response) {
    const unitTypes = await UnitType.find({})

    res.status(200).json(unitTypes)
  }
}

export default new CommonController()
