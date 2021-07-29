import { Request, Response } from 'express'
import fs from 'fs'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import moment from 'moment'
import {
  ReportBilling,
  ReportDm,
  ReportEiq,
  ReportSignersByCompany,
  ReportXlsForEiq
} from '../interfaces'
import models from '../models'
import { CropRepository, TypeActivity } from '../repositories'
import ExportFile from '../services/common/ExportFileService'
import Company from '../services/CompanyService'
import CropService from '../services/CropService'
import EmailService from '../services/EmailService'
import ReportService from '../services/ReportService'
import {
  reportHeaderBillingXls,
  ReportsDmHeaderXls,
  ReportsEiqHeaderXls,
  ReportsSignersByCompaniesHeaderXls,
  ReportsXlsForEiqHeaderXls
} from '../types/'
import { errors, typeActivityMap } from '../types/common'
import {
  filterDataCropsByCompanies,
  getCropPipelineDmReportUtils,
  getCropPipelineEiqReportUtils,
  getCropPipelineXlsForEiqReportUtils,
  getDataCropsForBilling,
  structJsonForXls,
  validateTypeActivity
} from '../utils'

const Lot = models.Lot

class ReportsController {
  /**
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async generateCrops(req: Request, res: Response | any) {
    const cuit = req.query.cuit
    const mode: any = req.query.mode || 'xls'

    const company = await Company.search({ identifier: cuit })

    if (!company[0])
      return res.status(404).json({ err: req.__('companies.errors.not_found') })

    if (!(mode === 'csv' || mode === 'xls')) {
      return res
        .status(400)
        .json({ err: req.__('reports.errors.not_allowed_mode', { mode }) })
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

  public async generateDataSet(req: Request, res: Response) {
    const mode: any = req.query.mode || 'json'

    const crops = await CropService.getAll()

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
  public async sendFileReport(req: Request, res: Response) {
    const { email, identifier } = req.body
    const language =
      req.header('Accept-Language') !== undefined
        ? req.header('Accept-Language')
        : 'es'
    const user: any = req.user

    console.log(language)
    return

    const crops = await CropService.cropsOnlySeeRoles({
      cancelled: false,
      'members.user': user._id,
      'members.identifier': identifier
    })

    if (crops.length === 0) {
      const error = errors.find((error) => error.key === '001')
      return res.status(400).json(error.code)
    }

    const reports = await ReportService.generateLotReports(crops, language)

    const pathFile = ExportFile.modeExport(reports, 'xls', language)

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
  public async reportsSignersByCompanies(req: Request, res: Response) {
    const email: string = req.query.email as string
    const identifier: string = req.query.identifier as string

    const crops = await CropRepository.findAllCropsByCompanies(identifier)

    if (!crops) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
    }

    const cropsByCompanies = filterDataCropsByCompanies(crops, identifier)

    const reports: Array<ReportSignersByCompany> =
      structJsonForXls(cropsByCompanies)

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
  public async reportsEiq(req: Request, res: Response) {
    const email: string = req.query.email as string
    const identifier: string = req.query.identifier as string

    const cropPipeline: any = getCropPipelineEiqReportUtils({ identifier })

    const report: Array<ReportEiq> = await CropRepository.findCrops(
      cropPipeline
    )

    if (!report) {
      const error = errors.find((error) => error.key === '005')
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

  /**
   * Send export file DM report in email.
   *
   * @param req
   * @param res
   */
  public async reportsDm(req: Request, res: Response) {
    const email: string = req.query.email as string
    const identifier: string = req.query.identifier as string

    const cropPipeline: any = getCropPipelineDmReportUtils({ identifier })

    const report: Array<ReportDm> = await CropRepository.findCrops(cropPipeline)

    if (!report) {
      const error = errors.find((error) => error.key === '005')
      return res.status(404).json(error.code)
    }

    const pathFile = ExportFile.exportXls(report, ReportsDmHeaderXls, 'DM.xlsx')

    await EmailService.sendWithAttach({
      template: 'export-file',
      to: email,
      data: {},
      files: [
        {
          filename: 'DM.xlsx',
          content: fs.readFileSync(pathFile)
        }
      ]
    })

    return res.status(200).json('Ok')
  }

  /**
   * Send export file xls to eiq report in email.
   *
   * @param req
   * @param res
   */
  public async reportsXlsForEiq(req: Request, res: Response) {
    const email: string = req.query.email as string

    const cropPipeline: any = getCropPipelineXlsForEiqReportUtils()

    const report: Array<ReportXlsForEiq> = await CropRepository.findCrops(
      cropPipeline
    )

    if (!report) {
      const error = errors.find((error) => error.key === '005')
      return res.status(StatusCodes.BAD_REQUEST).json(error.code)
    }

    const pathFile = ExportFile.exportXls(
      report,
      ReportsXlsForEiqHeaderXls,
      'XLSForEiq.xlsx'
    )

    await EmailService.sendWithAttach({
      template: 'export-file',
      to: email,
      data: {},
      files: [
        {
          filename: 'XLSForEiq.xlsx',
          content: fs.readFileSync(pathFile)
        }
      ]
    })

    return res.status(StatusCodes.OK).json(req.__('reports.send_mail_success'))
  }

  /**
   * Send export file report in email.
   *
   * @param req
   * @param res
   */
  public async sendFileReportBilling(req: Request, res: Response) {
    const email: string = req.query.email as string
    const identifier: string = req.query.identifier as string
    const type: TypeActivity = req.query.typeActivity as TypeActivity

    if (!validateTypeActivity(type)) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ error: 'ERROR_INVALID_FIELD', param: 'typeActivity' })
    }

    const crops = await CropRepository.findCropsFilterActivityForBilling(
      {
        cancelled: false,
        'members.identifier': identifier
      },
      type
    )

    if (!crops) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: ReasonPhrases.NOT_FOUND })
    }

    const report: ReportBilling[] = getDataCropsForBilling(crops)

    const pathFile = ExportFile.exportXls(
      report,
      reportHeaderBillingXls,
      `BILLING_${typeActivityMap[type]}.xlsx`
    )

    await EmailService.sendWithAttach({
      template: 'export-file',
      to: email,
      data: {},
      files: [
        {
          filename: `BILLING_${typeActivityMap[type]}.xlsx`,
          content: fs.readFileSync(pathFile)
        }
      ]
    })

    return res.json(ReasonPhrases.OK)
  }

  public async showMap(req: Request, res: Response) {
    const { id } = req.query

    if (!id) res.status(403).json({ error: req.__('reports.show_map.error') })
    const lot: any = await Lot.findById(id)

    res.render('index', {
      api_key: process.env.GOOGLE_API_KEY,
      flightPlanCoordinates: lot.coordinateForGoogle,
      center: lot.centerBoundGoogle,
      title: req.__('reports.show_map.title')
    })
  }
}

export default new ReportsController()
