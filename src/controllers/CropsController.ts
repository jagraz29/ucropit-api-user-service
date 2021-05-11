import { Request, Response } from 'express'
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode
} from 'http-status-codes'

import models from '../models'
import CropService from '../services/CropService'
import LotService from '../services/LotService'
import CompanyService from '../services/CompanyService'
import ActivityService from '../services/ActivityService'

import { CropRepository } from '../repository'
import { PdfService } from '../services'
import { basePath, getActivitiesOrderedByDateUtils, makeDirIfNotExists, calculateDataCropUtils } from '../utils'

import {
  validateGetCrops,
  validateCropStore,
  validateFormatKmz,
  validateNotEqualNameLot
} from '../utils/Validation'

import { UserSchema } from '../models/user'
import { errors } from '../types/common'
import { ReportSignersByCompany } from '../interfaces'
import path from 'path'

const Crop = models.Crop
const CropType = models.CropType

class CropsController {
  /**
   *
   * Get all crops.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async index (req: Request | any, res: Response) {
    let query: any = {
      $and : [
        {
          cancelled: false
        },
        {
          'members.user': req.user._id
        },
        {
          'members.identifier': req.query.identifier
        }
      ]
    }

    if (req.query.cropTypes) {
      query['$and'].push({
        cropType : {
          $in: req.query.cropTypes
        }
      })
    }

    if (req.query.companies) {
      query['$and'].push({
        company : {
          $in: req.query.companies
        }
      })
    }

    if (req.query.collaborators) {
      query['$and'].push({
        'members.user' : {
          $in: req.query.collaborators
        }
      })
    }

    if (req.query.cropVolume) {
      query['$and'].push({
        pay : {
          $gte: req.query.cropVolume
        }
      })
    }

    const crops = await Crop.find(query)
      .populate('company')
      .populate('cropType')
      .populate('unitType')
      .populate('pending')
      .populate('toMake')
      .populate('done')
      .populate('members.user')
      .populate('finished')
      .lean()

    res.status(200).json(crops)
  }

  /**
   * Get one crop.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async show (req: Request, res: Response) {
    const { id } = req.params
    const crop = await CropService.getCrop(id)
    const lots = await LotService.storeLotImagesAndCountries(crop.lots)

    const newCrop = {
      ...crop,
      lots
    }

    res.status(200).json(newCrop)
  }

  /**
   * Get one crop.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async getCropWithActivities (req: Request, res: Response) {
    const { id } = req.params
    const crop = await CropRepository.getCropWithActivities(id)

    if (!crop) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
    }
    const activities: Array<ReportSignersByCompany> = getActivitiesOrderedByDateUtils(crop)

    res.status(StatusCodes.OK).json(activities)
  }

  /**
   * Generate pdf crop history.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async generatePdfHistoryCrop (req: Request, res: Response) {
    const { params: { id } } = req
    // se obtienes crop con sus actividades
    const crop = await CropRepository.getCropWithActivities(id)

    if (!crop) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
    }

    // aca estara la libreria a nivel de crop con el recurso de actividades
    const dataCrop = calculateDataCropUtils(crop)

    // // aca esta la libreria a nivel de actividades
    const activities: Array<ReportSignersByCompany> = getActivitiesOrderedByDateUtils(crop)

    // aca se obtienen todos los crop de la company
    // const crops = await CropRepository.getCropWithActivities(crop.contactocomercial)

    // aca se calcula el potencial teorico
    // const eiq = calculateEiq(crops)

    // // aca se unen el ptencial teorico con lo del crop ya calculado
    // dataPdf = { crop, eiq, date: new Date() }
    const dataPDF = {
      array: [
        {
          lot: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEu24ChRXtuv9btEVw3LTxt0vVvQDcbQbEnQ&usqp=CAU",
          location: "Santa Eugenia Navarro, Buenos Aires"
        },
        {
          lot: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEu24ChRXtuv9btEVw3LTxt0vVvQDcbQbEnQ&usqp=CAU",
          location: "Santa Eugenia Navarro, Buenos Aires"
        }
      ]
    }

    // // aca se utiliza el service para generar el pdf, este debe devoler el path para descargar el pdf
    const nameFile = await PdfService.generatePdf('pdf-crop-history',dataPDF,'pdf-crop-history', 'company')

    // este debe devoler el endpoint para descargar el pdf como respuesta del endpoint
    res.status(StatusCodes.OK).send({ nameFile })

  }

  /**
   * Get pdf crop history.
   *
   * @param  Request req
   *
   * @return Response
   * @param res
   */
  public async pdfHistoryCrop ({ params: { nameFile } }: Request, res: Response) {
    res.sendFile(path.resolve(`public/uploads/pdf-crop-history/${nameFile}`))
  }

  /**
   * Create a crop
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async create (req: Request | any, res: Response) {
    const user: UserSchema = req.user
    const data = JSON.parse(req.body.data)
    await validateCropStore(data)
    const validationKmz = await validateFormatKmz(req.files)
    const validationDuplicateName = validateNotEqualNameLot(data.lots)

    let company = null

    if (validationKmz.error) {
      return res.status(400).json({
        error: true,
        code: validationKmz.code,
        message: validationKmz.message
      })
    }

    if (validationDuplicateName.error) {
      return res.status(400).json(validationDuplicateName.code)
    }

    company = (await CompanyService.search({ identifier: data.identifier }))[0]

    const lots = await LotService.store(req, data.lots)

    const activities = await ActivityService.createDefault(
      data.surface,
      data.dateCrop,
      user
    )

    const crop = await CropService.handleDataCrop(
      data,
      company,
      lots,
      activities,
      { members: req.user }
    )

    res.status(201).json(crop)
  }

  /**
   * Show last monitoring
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async showLastMonitoring (req: Request, res: Response) {
    const monitoring = await CropService.getLastMonitoring(req.params.id)

    res.status(200).json(monitoring)
  }

  /**
   * Update a crop
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async update (req: Request, res: Response) {
    const user: UserSchema = req.user
    const data = JSON.parse(req.body.data)
    let company = null

    company = (await CompanyService.search({ identifier: data.identifier }))[0]

    const crop = await Crop.findById(req.params.id)

    crop.company = company ? company._id : null

    await crop.save()

    res.status(200).json(crop)
  }

  /**
   * Enable offline for crop
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async enableOffline (req: Request, res: Response) {
    const crop = await Crop.findById(req.params.id)

    crop.downloaded = req.body.downloaded

    await crop.save()

    res.status(200).json(crop)
  }

  /**
   * Add integration Service.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async addIntegrationService (req: Request, res: Response) {
    const crop = await Crop.findById(req.params.id)
    const data = req.body

    crop.synchronizedList.push(data)

    await crop.save()

    res.status(200).json(crop)
  }

  /**
   * Delete one crop.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async delete (req: Request, res: Response) {
    const isCancelled = await CropService.cancelled(req.params.id)

    if (!isCancelled) {
      return res.status(400).json({
        error: true,
        message: 'deleted not allowd'
      })
    }

    res.status(200).json({
      message: 'deleted successfuly'
    })
  }
}

export default new CropsController()
