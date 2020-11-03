import { Request, Response } from 'express'

import CropService from '../services/CropService'
import ReportService from '../services/ReportService'

class ReportsController {
  /**
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async generateCrops (req: Request, res: Response) {
    const { cuit } = req.query

    let crops = await CropService.getAll()

    crops = CropService.filterCropByIdentifier(cuit, crops)

    const report = await ReportService.generateCropReport(crops, cuit)

    console.log(report)

    res.status(200).json(crops)
  }
}

export default new ReportsController()
