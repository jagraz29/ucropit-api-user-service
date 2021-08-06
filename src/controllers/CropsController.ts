/* tslint:disable:await-promise */
import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import models from '../models'
import CropService from '../services/CropService'
import LotService from '../services/LotService'
import CompanyService from '../services/CompanyService'
import ActivityService from '../services/ActivityService'
import {
  Evidence,
  IEiqRangesDocument,
  ReportSignersByCompany
} from '../interfaces'

import { CropRepository, EiqRangesRepository } from '../repositories'
import { PDFService } from '../services'
import {
  getActivitiesOrderedByDateUtils,
  getCropUtils,
  calculateTheoreticalPotentialUtils,
  calculateCropVolumeUtils,
  getCropBadgesByUserType,
  parseLotsReusableAsData,
  filterActivitiesMakeByDates,
  calculateEIQAndPercentTotal,
  defaultLanguageConfig,
  translateCropActivities
} from '../utils'

import { UserSchema } from '../models/user'
import { errors } from '../types/common'
import moment from 'moment'

const Crop = models.Crop

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
    const query: any = {
      $and: [
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
        cropType: {
          $in: req.query.cropTypes
        }
      })
    }

    if (req.query.companies) {
      query['$and'].push({
        company: {
          $in: req.query.companies
        }
      })
    }

    if (req.query.collaborators) {
      query['$and'].push({
        'members.user': {
          $in: req.query.collaborators
        }
      })
    }

    if (req.query.cropVolume) {
      query['$and'].push({
        pay: {
          $gte: req.query.cropVolume
        }
      })
    }

    const crops = await Crop.find(query)
      .populate({ path: 'company', populate: [{ path: 'country' }] })
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
    const language =
      req.header('Accept-Language') || defaultLanguageConfig.language
    const { id } = req.params
    const { startDate, endDate } = req.query
    const crop = await CropService.getCrop(id)
    const translatedCrop = translateCropActivities(crop, language)
    const lots = await LotService.storeLotImagesAndCountriesWithPopulate(
      translatedCrop.lots
    )
    const crops = await CropRepository.findAllCropsByCompanyAndCropType(crop)
    const theoriticalPotential = calculateTheoreticalPotentialUtils(crops)
    const badges = getCropBadgesByUserType(req.user, crop, language)

    const volume = calculateCropVolumeUtils(
      translatedCrop.unitType.key,
      translatedCrop.pay,
      translatedCrop.surface
    )

    const toMakeFilterDates = filterActivitiesMakeByDates(
      translatedCrop.toMake,
      startDate,
      endDate
    )

    const toMake = calculateEIQAndPercentTotal(toMakeFilterDates, language)
    const done = calculateEIQAndPercentTotal(translatedCrop.done, language)
    const finished = calculateEIQAndPercentTotal(
      translatedCrop.finished,
      language
    )

    const newCrop = {
      ...translatedCrop,
      volume,
      lots,
      company: {
        ...translatedCrop.company,
        theoriticalPotential
      },
      badges,
      toMake,
      done,
      finished
    }

    res.status(200).json(newCrop)
  }
  /**
   * Get Crop With Lots.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async getCropWithLots(req: Request, res: Response) {
    const {
      params: { id }
    } = req
    const crop = await CropRepository.getCropWithActivities(id)

    if (!crop) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
    }
    const crops = await CropRepository.findAllCropsByCompanyAndCropType(crop)

    const eiqRanges: IEiqRangesDocument[] =
      await EiqRangesRepository.getAllEiq()

    const theoriticalPotential = calculateTheoreticalPotentialUtils(crops)

    const activities: Array<ReportSignersByCompany> =
      getActivitiesOrderedByDateUtils(crop)

    const dataCrop = getCropUtils(
      crop,
      activities,
      theoriticalPotential,
      eiqRanges
    )
    delete dataCrop.activities

    res.status(StatusCodes.OK).send(dataCrop)
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

    console.log(activities)

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
      params: { id }
    } = req
    const language =
      req.header('Accept-Language') || defaultLanguageConfig.language

    const crop = await CropRepository.getCropWithActivities(id)

    if (!crop) {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
    }
    const crops = await CropRepository.findAllCropsByCompanyAndCropType(crop)

    const eiqRanges: IEiqRangesDocument[] =
      await EiqRangesRepository.getAllEiq()

    const theoriticalPotential = calculateTheoreticalPotentialUtils(crops)

    const activities: Array<ReportSignersByCompany> =
      getActivitiesOrderedByDateUtils(crop)

    const dataCrop = getCropUtils(
      crop,
      activities,
      theoriticalPotential,
      eiqRanges
    )

    const dataPdf = {
      crop: dataCrop,
      activities,
      dateCreatePdf: moment().locale('es').format('DD/MM/YYYY'),
      bucketUrl: process.env.CROP_STORY_BUCKET_URL,
      bucketUrlNew: process.env.CROP_STORY_BUCKET_NEW_URL
    }

    const nameFile = await PDFService.generatePdf(
      'pdf-crop-history',
      dataPdf,
      'pdf-crop-history',
      'company',
      crop,
      language
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
    const { data } = req.body
    const { identifier } = data
    let company = null
    let lots = []

    if (data.lots) {
      lots = await LotService.store(req, data.lots)
    }

    if (data.reusableLots) {
      lots = [...lots, ...parseLotsReusableAsData(data.reusableLots)]
    }

    company = (await CompanyService.search({ identifier }))[0]

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
    const data = JSON.parse(req.body.data)
    let company = null

    company = (await CompanyService.search({ identifier: data.identifier }))[0]

    const crop: any = await Crop.findById(req.params.id)

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
    const crop: any = await Crop.findById(req.params.id)

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
    const crop: any = await Crop.findById(req.params.id)
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
        message: req.__('commons.deletion_not_allowed')
      })
    }

    res.status(200).json({
      message: req.__('commons.deleted_success')
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
