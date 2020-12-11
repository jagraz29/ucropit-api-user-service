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
    const { ids } = req.params

    console.log(ids)
  }
}

export default new ExporterController()
