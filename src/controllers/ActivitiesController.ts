import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import {
  ActivityRepository,
  TypeAgreementRepository,
  BadgeRepository,
  CropRepository,
  activityTypeRepository
} from '../repositories'
import { IEnvImpactIndexDocument, TypeActivities } from '../interfaces'
import {
  validateActivityStore,
  validateActivityUpdate,
  validateFilesWithEvidences,
  validateExtensionFile
} from '../utils/Validation'
import {
  sumActivitiesSurfacesByTypeAgreement,
  getCropBadgesReached,
  calculateCropEiq,
  calculateEiqOfActivity,
  groupedLotsByTagsInActivity
} from '../utils'

import ActivityService from '../services/ActivityService'
import CropService from '../services/CropService'
import BlockChainServices from '../services/BlockChainService'
import ApprovalRegisterSingService from '../services/ApprovalRegisterSignService'
import SatelliteImageService from '../services/SatelliteImageService'
import IntegrationService from '../services/IntegrationService'
import UserConfigService from '../services/UserConfigService'
import models from '../models'

import {
  getPathFileByType,
  getFullPath,
  fileExist,
  removeFile
} from '../utils/Files'

import { ACTIVITY_HARVEST } from '../utils/Constants'
import { errors } from '../types'
import {
  setEiqInEnvImpactIndexActivity,
  setEnvImpactIndexInActivity
} from '../core'

const Activity = models.Activity
const FileDocument = models.FileDocument
const Crop = models.Crop

class ActivitiesController {
  /**
   *
   * Get all activities and filter by cropId.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async index(req: Request | any, res: Response) {
    let activities = []
    const { ids } = req.query

    if (ids) {
      activities = await ActivityService.getActivitiesByIds(JSON.parse(ids))
    } else {
      activities = await ActivityService.getActivities()
    }

    res.status(200).json(activities)
  }

  /**
   * Show one activity
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async show(req: Request, res: Response) {
    const activity =
      await ActivityRepository.findActivityByIdWithPopulateAndVirtuals(
        req.params.id
      )

    const lang = req.getLocale() as string
    const activityWithEIQ = calculateEiqOfActivity(activity, lang)
    res.status(200).json(activityWithEIQ)
  }

  /**
   * Show one activity grouped by Tags
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async showAndLotsGroupedByTags(req: Request, res: Response) {
    const { id } = req.params
    const { cropId } = req.query
    const activity =
      await ActivityRepository.findActivityByIdWithPopulateAndVirtuals(id)
    const crop = await CropRepository.findOneSample({ _id: cropId })

    const lang = req.getLocale() as string
    const activities = groupedLotsByTagsInActivity(
      calculateEiqOfActivity(activity, lang),
      crop,
      lang
    )
    res.status(StatusCodes.OK).json(activities)
  }

  /**
   * Store one activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async create(req: Request, res: Response) {
    const user: any = req.user
    const data = JSON.parse(req.body.data)

    await validateActivityStore(data)

    const { companySelected } = await UserConfigService.findById(user.config)

    const validationExtensionFile = validateExtensionFile(req.files)

    if (validationExtensionFile.error) {
      return res.status(400).json(validationExtensionFile.code)
    }

    const validationFiles = validateFilesWithEvidences(
      req.files,
      data.evidences
    )

    if (validationFiles.error) {
      return res.status(400).json(validationFiles)
    }

    let activity = await ActivityService.store(data, user)

    if (req.files) {
      activity = await ActivityService.addFiles(
        activity,
        data.evidences,
        req.files,
        user,
        `activities/${activity.key}`
      )
    }

    const crop = await Crop.findById(data.crop)

    await CropService.addActivities(activity, crop)

    try {
      const { tag: TypeActivity } = data
      if (TypeActivity === TypeActivities.ACT_APPLICATION) {
        const envImpactIndexId: IEnvImpactIndexDocument =
          await setEiqInEnvImpactIndexActivity({ ...data, activity })
        await setEnvImpactIndexInActivity(envImpactIndexId)
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        description: errors.find((error) => error.key === '008').code
      })
    }

    if (activity.isDone() && activity.type.tag === ACTIVITY_HARVEST) {
      await SatelliteImageService.createPayload(activity).send()

      await IntegrationService.exportActivity(
        {
          cropId: data.crop._id,
          activityId: activity._id,
          erpAgent: 'auravant',
          identifier: companySelected.identifier
        },
        req
      )
    }

    res.status(StatusCodes.CREATED).json(activity)
  }

  /**
   * Update one activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async update(req: Request, res: Response) {
    const { id } = req.params
    const user: any = req.user
    const data = JSON.parse(req.body.data)

    const { companySelected } = await UserConfigService.findById(user.config)

    const { status } = data
    await validateActivityUpdate(data)

    const validationExtensionFile = validateExtensionFile(req.files)

    if (validationExtensionFile.error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(validationExtensionFile.code)
    }

    const validationFiles = validateFilesWithEvidences(
      req.files,
      data.evidences
    )

    if (validationFiles.error) {
      return res.status(StatusCodes.BAD_REQUEST).json(validationFiles)
    }

    let activity = await ActivityService.findActivityById(id)
    if (data.signers) {
      const listSigners = ActivityService.getSigners(data.signers, activity)

      data.signers = listSigners
    }

    activity = await ActivityService.update(id, data)

    if (req.files) {
      activity = await ActivityService.addFiles(
        activity,
        data.evidences,
        req.files,
        user,
        `activities/${activity.key}`
      )
    }

    if (status) {
      const crop = await Crop.findById(data.crop)
      activity = await ActivityService.findActivityById(id)

      const statusCropRemove = 'pending'
      await CropService.removeActivities(activity, crop, statusCropRemove)
      await CropService.addActivities(activity, crop)
    }

    if (activity.isDone() && activity.type.tag === ACTIVITY_HARVEST) {
      await SatelliteImageService.createPayload(activity).send()

      await IntegrationService.exportActivity(
        {
          cropId: data.crop,
          activityId: activity._id,
          erpAgent: 'auravant',
          identifier: companySelected.identifier
        },
        req
      )
    }

    res.status(StatusCodes.CREATED).json(activity)
  }

  /**
   * Sign Activity
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async sign(req: Request, res: Response) {
    req.setTimeout(0)
    const { id, cropId } = req.params
    const user = req.user

    let activity: any = await Activity.findById(id)
      .populate('type')
      .populate('typeAgreement')
      .populate('unitType')
      .populate('lots')
      .populate('files')

    activity = await ActivityService.signUserAndUpdateSing(activity, user)

    const isCompleteSigned = ActivityService.isCompleteSingers(activity)

    if (isCompleteSigned) {
      const crop: any = await Crop.findById(cropId).populate('cropType')

      const { ots, hash, pathPdf, nameFilePdf, nameFileOts, pathOtsFile } =
        await BlockChainServices.sign(crop, activity)

      const approvalRegisterSign = await ApprovalRegisterSingService.create({
        ots,
        hash,
        pathPdf,
        nameFilePdf,
        nameFileOts,
        pathOtsFile,
        activity
      })

      activity.approvalRegister = approvalRegisterSign._id

      await ActivityService.changeStatus(activity, 'FINISHED')
      await CropService.removeActivities(activity, crop, 'done')
      await CropService.addActivities(activity, crop)

      /**********************************/
      /*       ADD BADGES TO CROP       */
      /**********************************/

      /*
      FIND ACTIVITIES BY SIGNED TRUE AND BE TYPE AGREEMENT
      */
      const dataToFindActivities: any = {
        query: {
          _id: {
            $in: [...crop.toMake, ...crop.done, ...crop.finished]
          },
          'signers.signed': {
            $nin: [false]
          }
        },
        populate: [
          {
            path: 'type',
            match: {
              tag: TypeActivities.ACT_AGREEMENTS
            }
          },
          {
            path: 'typeAgreement'
          }
        ]
      }

      let activities: Array<any> = await ActivityRepository.getActivities(
        dataToFindActivities
      )

      activities = activities.filter(
        (activity) => activity.type && activity.typeAgreement
      )

      /*
       * SUM ALL SURFACES OF ACTIVITIES BY TYPE AGREEMENT AND CROP TYPE IN SOME CASE
       */
      const activitiesSurfaces: any = sumActivitiesSurfacesByTypeAgreement(
        activities,
        crop
      )

      /*
       * FIND ALL TYPE AGREEMENTS
       */
      const typeAgreements: Array<any> =
        await TypeAgreementRepository.getTypeAgreements({})

      /*
       * FIND ALL BADGES
       */
      const badges: Array<any> = await BadgeRepository.getBadges({})

      /*
       * FIND ACTIVITIES BY SIGNED TRUE AND TYPE BE APPLICATION FOR AFTER GET THE CROP EIQ
       */
      const dataToFindApplicationActivities: any = {
        query: {
          _id: {
            $in: [...crop.toMake, ...crop.done, ...crop.finished]
          }
        },
        populate: [
          {
            path: 'type',
            match: {
              tag: TypeActivities.ACT_APPLICATION
            }
          },
          {
            path: 'achievements',
            match: {
              'signers.signed': {
                $nin: [false]
              }
            },
            populate: [
              {
                path: 'supplies.supply'
              }
            ]
          }
        ]
      }

      let applicationActivities: Array<any> =
        await ActivityRepository.getActivities(dataToFindApplicationActivities)

      applicationActivities = applicationActivities.filter(
        (activity) => activity.type && activity.achievements
      )

      /*
       * GET CROP EIQ
       */
      const cropEiq: number = calculateCropEiq(applicationActivities)

      /*
       * GET BADGES TO ADD TO CROP
       */
      const badgesToAdd: Array<any> = getCropBadgesReached(
        typeAgreements,
        badges,
        activitiesSurfaces,
        crop,
        cropEiq
      )

      /*
       * ADD BADGES TO CROP
       */
      const query: any = {
        _id: crop._id
      }

      const dataToUpdate: any = {
        badges: badgesToAdd
      }

      await CropRepository.updateOneCrop(query, dataToUpdate)
    }

    res.status(StatusCodes.OK).json(activity)
  }

  /**
   * Validate Activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async validate(req: Request, res: Response) {
    const { id, cropId } = req.params
    const { status } = req.body

    let activity: any = await Activity.findById(id).populate('type')

    await ActivityService.changeStatus(activity, status)

    activity = await Activity.findById(id).populate('type')

    const crop = await Crop.findById(cropId)

    const statusCrop =
      activity.type.tag === 'ACT_AGREEMENTS' ||
      activity.type.tag === 'ACT_MONITORING'
        ? 'pending'
        : 'toMake'

    await CropService.removeActivities(activity, crop, statusCrop)
    await CropService.addActivities(activity, crop)

    res.status(200).json(activity)
  }

  /**
   * Delete one activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async delete(req: Request, res: Response) {
    await Activity.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'deleted successfully'
    })
  }

  /**
   * Delete File to company.
   *
   * @param Request req
   * @param Response res
   *
   * @return {Response}
   */
  public async removeFile(req: Request, res: Response) {
    const { id, fileId } = req.params

    const activity: any = await Activity.findOne({ _id: id })
    const document: any = await FileDocument.findOne({ _id: fileId })

    const fileRemove = await ActivityService.removeFiles(
      fileId,
      activity,
      `${getFullPath(getPathFileByType('activity'))}/${activity.key}/${
        document.nameFile
      }`
    )

    if (!fileRemove) {
      return res
        .status(404)
        .json({ error: true, message: req.__('commons.not_found') })
    }

    res.status(200).json({
      message: req.__('commons.deleted_success')
    })
  }

  /**
   * Delete Files to activity.
   *
   * @param Request req
   * @param Response res
   *
   * @return {Response}
   */
  public async removeFiles(req: Request, res: Response) {
    const { id } = req.params
    const data = req.body

    const activity: any = await Activity.findOne({ _id: id })
    const documents: any = await FileDocument.find({ _id: { $in: data } })

    let files = activity.files

    await Promise.all(
      documents.map(async (document) => {
        const filePath = `${getFullPath(getPathFileByType('activity'))}/${
          activity.key
        }/${document.nameFile}`

        if (fileExist(filePath)) removeFile(filePath)

        const fileRemove = await FileDocument.findByIdAndDelete(document._id)

        if (fileRemove) {
          files = files.filter(
            (item) => item.toString() !== document._id.toString()
          )
        }

        return Promise
      })
    )

    activity.files = files

    await activity.save()

    res.status(200).json({
      message: req.__('commons.deleted_success')
    })
  }
}

export default new ActivitiesController()
