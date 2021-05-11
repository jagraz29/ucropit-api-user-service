import { Request, Response } from 'express'
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode
} from 'http-status-codes'
import moment from 'moment'

import CropService from '../services/CropService'
import ReportService from '../services/ReportService'
import ExportFile from '../services/common/ExportFileService'
import Company from '../services/CompanyService'
import EmailService from '../services/EmailService'
import {
  ReportsSignersByCompaniesHeaderXls,
  ReportsEiqHeaderXls
} from '../types/'

import { CropRepository } from '../repository'
import {
  structJsonForXls,
  getCropPipelineEiqReportUtils,
  filterDataCropsByCompanies
} from '../utils'
import { ReportSignersByCompany, ReportEiq } from '../interfaces'

import { roles, errors } from '../types/common'

import fs from 'fs'

import models from '../models'

const Lot = models.Lot
const Crop = models.Crop

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

    const report = await ReportService.generateCropReport(crops)

    const pathFile = ExportFile.modeExport(report, mode)

    if (mode === 'csv') {
      res.attachment('dashboard_soja_sustentable.csv')
      res.status(200).send(pathFile)
    }

    res.download(pathFile)
  }

  public async generateDataSet (req: Request, res: Response) {
    const mode: any = req.query.mode || 'json'

    let crops = await CropService.getAll()

    const dataset = ReportService.generateDataSet(crops)

    const pathFile = ExportFile.dataSetExport(dataset, mode)

    res.download(pathFile)
  }

  /**
   * Send export file report in email.
   *
   * @param req
   * @param res
   */
  public async sendFileReport (req: Request, res: Response) {
    const { email, identifier } = req.body
    const user: any = req.user

    let crops = await CropService.cropsOnlySeeRoles({
      cancelled: false,
      'members.user': user._id,
      'members.identifier': identifier
    })

    if (crops.length === 0) {
      const error = errors.find(error => error.key === '001')
      return res.status(400).json(error.code)
    }

    const reports = await ReportService.generateLotReports(crops)

    const pathFile = ExportFile.modeExport(reports, 'xls')

    const today = moment()

    await EmailService.sendWithAttach({
      template: 'export-file',
      to: email,
      data: {},
      files: [
        {
          filename: `report_global_${identifier}_${today.format(
            'DD-MM-YYYY'
          )}.xlsx`,
          content: fs.readFileSync(pathFile)
        }
      ]
    })

    return res.status(200).json('Ok')
  }

  /**
   * Send export file report by companies in email.
   *
   * @param req
   * @param res
   */
  public async reportsSignersByCompanies (req: Request, res: Response) {
    const email: string = req.query.email as string
    const identifier: string = req.query.identifier as string

    let crops = await CropRepository.findAllCropsByCompanies(identifier)

    if (!crops) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
    }

    let cropsByCompanies = await filterDataCropsByCompanies(crops, identifier)

    const reports: Array<ReportSignersByCompany> = structJsonForXls(
      cropsByCompanies
    )
    const pathFile = ExportFile.exportXls(
      reports,
      ReportsSignersByCompaniesHeaderXls,
      'signers_by_companies.xlsx'
    )

    await EmailService.sendWithAttach({
      template: 'export-file',
      to: email,
      data: {},
      files: [
        {
          filename: 'signers_by_companies.xlsx',
          content: fs.readFileSync(pathFile)
        }
      ]
    })

    return res.status(StatusCodes.OK).send(ReasonPhrases.OK)
  }

  /**
   * Send export file report by eiq in email.
   *
   * @param req
   * @param res
   */
  public async reportsEiq (req: Request, res: Response) {
    const email: string = req.query.email as string
    const identifier: string = req.query.identifier as string

    const cropPipeline: any = getCropPipelineEiqReportUtils({ identifier })

    const report = await CropRepository.findCrops(cropPipeline)

    if (!report) {
      const error = errors.find(error => error.key === '005')
      return res.status(404).json(error.code)
    }

    const pathFile = ExportFile.exportXls(
      report,
      ReportsEiqHeaderXls,
      'EIQ.xlsx'
    )

    await EmailService.sendWithAttach({
      template: 'export-file',
      to: email,
      data: {},
      files: [
        {
          filename: 'EIQ.xlsx',
          content: fs.readFileSync(pathFile)
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
