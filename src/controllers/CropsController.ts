import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import models from '../models'
import CropService from '../services/CropService'
import LotService from '../services/LotService'
import CompanyService from '../services/CompanyService'
import ActivityService from '../services/ActivityService'
import { Evidence, ReportSignersByCompany } from '../interfaces'

import { CropRepository } from '../repositories'
import { PDFService } from '../services'
import {
  getActivitiesOrderedByDateUtils,
  calculateDataCropUtils,
  calculateTheoreticalPotentialUtils,
  calculateCropVolumeUtils,
  getCropBadgesByUserType,
} from '../utils'

import {
  validateCropStore,
  validateFormatKmz,
  validateNotEqualNameLot,
} from '../utils/Validation'

import { UserSchema } from '../models/user'
import { errors } from '../types/common'
import path from 'path'
import moment from 'moment'
import { UnitTypeSchema } from './../models/unitType'

const Crop = models.Crop
const UnitType = models.UnitType

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
  public async index(req: Request | any, res: Response) {
    let query: any = {
      $and: [
        {
          cancelled: false,
        },
        {
          'members.user': req.user._id,
        },
        {
          'members.identifier': req.query.identifier,
        },
      ],
    }

    if (req.query.cropTypes) {
      query['$and'].push({
        cropType: {
          $in: req.query.cropTypes,
        },
      })
    }

    if (req.query.companies) {
      query['$and'].push({
        company: {
          $in: req.query.companies,
        },
      })
    }

    if (req.query.collaborators) {
      query['$and'].push({
        'members.user': {
          $in: req.query.collaborators,
        },
      })
    }

    if (req.query.cropVolume) {
      query['$and'].push({
        volume: {
          $gte: req.query.cropVolume,
        },
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
  public async show(req: Request, res: Response) {
    const { id } = req.params
    const crop = await CropService.getCrop(id)
    const lots = await LotService.storeLotImagesAndCountries(crop.lots)
    const crops = await CropRepository.findAllCropsByCompanyAndCropType(crop)
    const theoriticalPotential = calculateTheoreticalPotentialUtils(crops)
    const badges = getCropBadgesByUserType(req.user, crop)
    const volume = calculateCropVolumeUtils(
      crop.unitType.key,
      crop.pay,
      crop.surface
    )

    const newCrop = {
      ...crop,
      volume,
      lots,
      company: {
        ...crop.company,
        theoriticalPotential,
      },
      badges,
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
  public async getCropWithActivities(req: Request, res: Response) {
    const { id } = req.params
    const crop = await CropRepository.getCropWithActivities(id)

    if (!crop) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
    }
    const activities: Array<ReportSignersByCompany> =
      getActivitiesOrderedByDateUtils(crop)

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
  public async generatePdfHistoryCrop(req: Request, res: Response) {
    const {
      params: { id },
    } = req
    const crop = await CropRepository.getCropWithActivities(id)

    if (!crop) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
    }
    const crops = await CropRepository.findAllCropsByCompanyAndCropType(crop)

    const theoriticalPotential = calculateTheoreticalPotentialUtils(crops)

    const activities: Array<ReportSignersByCompany> =
      getActivitiesOrderedByDateUtils(crop)

    const dataCrop = calculateDataCropUtils(crop, activities)

    const dataPdf = {
      dataCrop,
      theoriticalPotential,
      activities,
      dateCreatePdf: moment().format('DD/MM/YYYY'),
    }
    const nameFile = await PDFService.generatePdf(
      'pdf-crop-history',
      dataPdf,
      'pdf-crop-history',
      'company',
      crop
    )

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
  public async pdfHistoryCrop(
    { params: { nameFile } }: Request,
    res: Response
  ) {
    const dirPdf = `${process.env.BASE_URL}/${process.env.DIR_UPLOADS}/${process.env.DIR_PDF_CROP_HISTORY}/${nameFile}`
    return res.status(StatusCodes.OK).json(dirPdf)
  }

  /**
   * Create a crop
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async create(req: Request | any, res: Response) {
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
        message: validationKmz.message,
      })
    }

    if (validationDuplicateName.error) {
      return res.status(400).json(validationDuplicateName.code)
    }

    let volume: number = 0

    try {
      const unitType = await UnitType.findOne({ _id: data.unitType })

      volume = calculateCropVolumeUtils(unitType?.key, data.pay, data.surface)
    } catch (error) {
      console.log('Error calculating volume to crop')
      console.log(error)
    }

    data.volume = volume

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
  public async showLastMonitoring(req: Request, res: Response) {
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
  public async update(req: Request, res: Response) {
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
  public async enableOffline(req: Request, res: Response) {
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
  public async addIntegrationService(req: Request, res: Response) {
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
  public async delete(req: Request, res: Response) {
    const isCancelled = await CropService.cancelled(req.params.id)

    if (!isCancelled) {
      return res.status(400).json({
        error: true,
        message: 'deleted not allowd',
      })
    }

    res.status(200).json({
      message: 'deleted successfuly',
    })
  }

  /**
   * Get all crops evidences
   *
   * @param Request req
   * @param Response res
   *
   * @returns
   */
  public async evidences(req: Request, res: Response) {
    const { id } = req.params
    const evidences: Evidence[] = await CropRepository.findAllEvidencesByCropId(
      id
    )
    if (!evidences) {
      const error = errors.find((error) => error.key === '005')
      return res.status(404).json(error.code)
    }
    res.status(200).json(evidences)
  }
}

export default new CropsController()
