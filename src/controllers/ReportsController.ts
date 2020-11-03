import { Request, Response } from 'express'

import CropService from '../services/CropService'
import ReportService from '../services/ReportService'
import ExportFile from '../services/common/ExportFileService'

import models from '../models'

const Lot = models.Lot

class ReportsController {
  /**
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async generateCrops (req: Request, res: Response) {
    const { cuit, mode = 'xls' } = req.query

    let crops = await CropService.getAll()

    crops = CropService.filterCropByIdentifier(cuit, crops)

    const report = await ReportService.generateCropReport(crops, cuit)

    const pathFile = ExportFile.modeExport(report, mode)

    if (mode === 'csv') {
      res.attachment('report.csv')
      res.status(200).send(pathFile)
    }

    res.download(pathFile)
  }

  public async showMap (req: Request, res: Response) {
    const { id } = req.query

    if (!id) res.status(403).json({ error: 'MUST PASS ID LOT' })
    const lot = await Lot.findById(id)

    res.render('index', {
      api_key: process.env.GOOGLE_API_KEY,
      flightPlanCoordinates: lot.coordinateForGoogle,
      center: lot.centerBoundGoogle
    })
  }
}

export default new ReportsController()
