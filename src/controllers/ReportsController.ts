import { Request, Response } from 'express'

import CropService from '../services/CropService'
import ReportService from '../services/ReportService'
import ExportFile from '../services/common/ExportFileService'
import Company from '../services/CompanyService'
import EmailService from '../services/EmailService'

import fs from 'fs'

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
    const cuit = req.query.cuit
    const mode: any = req.query.mode || 'xls'

    const company = await Company.search({ identifier: cuit })

    if (!company[0]) return res.status(404).json({ err: 'NOT FOUND COMPANY' })

    if (!(mode === 'csv' || mode === 'xls')) {
      return res
        .status(400)
        .json({ err: `${mode} NOT ALLOWED export file mode` })
    }

    let crops = await CropService.getAll()

    crops = CropService.filterCropByIdentifier(cuit, crops)

    const report = await ReportService.generateCropReport(crops, cuit)

    const pathFile = ExportFile.modeExport(report, mode)

    if (mode === 'csv') {
      res.attachment('dashboard_soja_sustentable.csv')
      res.status(200).send(pathFile)
    }

    res.download(pathFile)
  }

  /**
   * Send export file report in email.
   *
   * @param req
   * @param res
   */
  public async sendFileReport (req, res: Response) {
    const { email, identifier } = req.body
    const user: any = req.user
    console.log(user)

    let crops = await CropService.getAll({
      cancelled: false,
      'members.user': user._id,
      'members.identifier': identifier
    })

    const report = await ReportService.generateCropReport(crops, identifier)

    const pathFile = ExportFile.modeExport(report, 'xls')

    await EmailService.sendWithAttach({
      template: 'export-file',
      to: email,
      data: {},
      files: [
        {
          path: pathFile
        }
      ]
    })

    return res.status(200).json('Ok')
  }

  public async showMap (req: Request, res: Response) {
    const { id } = req.query

    if (!id) res.status(403).json({ error: 'MUST PASS ID LOT' })
    const lot = await Lot.findById(id)

    res.render('index', {
      api_key: process.env.GOOGLE_API_KEY,
      flightPlanCoordinates: lot.coordinateForGoogle,
      center: lot.centerBoundGoogle,
      title: 'Localización Lote KMZ'
    })
  }
}

export default new ReportsController()
