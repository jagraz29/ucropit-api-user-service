import { Request, Response } from 'express'
import {
  validateAchievement,
  validateSignAchievement,
  validateFilesWithEvidences,
} from '../utils/Validation'

import AchievementService from '../services/AchievementService'
import ActivityService from '../services/ActivityService'
import CropService from '../services/CropService'
import BlockChainServices from '../services/BlockChainService'
import ApprovalRegisterSingService from '../services/ApprovalRegisterSignService'

import models from '../models'
import { FileDocumentSchema } from '../models/documentFile'

import UploadService from '../services/UploadService'
import ImageService from '../services/ImageService'

const Crop = models.Crop

class AchievementsController {
  /**
   * Get all achievements filter query.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async index(req: Request, res: Response) {
    const { activityId } = req.query

    if (activityId) {
      const activity = await ActivityService.findActivityById(
        String(activityId)
      )

      return res.status(200).json(activity.achievements)
    }

    const achievements = await AchievementService.find({})

    res.status(200).json(achievements)
  }

  /**
   * Get One Achievement.
   *
   * @param Request req
   * @param Response res
   *
   * @returns Response
   */
  public async show(req: Request, res: Response) {
    const { id } = req.params

    const achievement = await AchievementService.findById(id)

    res.status(200).json(achievement)
  }

  /**
   * Create a new Achievement.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async create(req: Request, res: Response) {
    const user = req.user
    const data = JSON.parse(req.body.data)

    await validateAchievement(data)

    const validationFiles = validateFilesWithEvidences(
      req.files,
      data.evidences
    )

    if (validationFiles.error) {
      res.status(400).json(validationFiles)
    }

    const activity = await ActivityService.findActivityById(data.activity)

    let achievement = await AchievementService.store(data, activity)

    await ActivityService.addAchievement(activity, achievement)

    if (activity.status[0].name.en !== 'DONE') {
      await ActivityService.changeStatus(activity, 'DONE')

      const crop = await Crop.findById(data.crop)

      await CropService.removeActivities(activity, crop, 'toMake')
      await CropService.addActivities(activity, crop)
    }

    if (req.files) {
      achievement = await AchievementService.addFiles(
        achievement,
        data.evidences,
        req.files,
        user,
        `achievements/${achievement.key}`
      )
    }

    res.status(201).json(achievement)
  }

  /**
   * User Sign to Achievement.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async signAchievement(req: Request, res: Response) {
    const user = req.user
    const { id } = req.params

    await validateSignAchievement(req.body)

    const { activityId, cropId } = req.body

    let achievement = await AchievementService.findById(id)
    let activity = await ActivityService.findActivityById(activityId)
    const crop = await Crop.findById(cropId).populate('cropType')

    await ActivityService.signUser(activity, user)

    await AchievementService.signUser(achievement, user)

    achievement = await AchievementService.findById(id)

    activity = await ActivityService.findActivityById(activityId)

    const isCompleteSigned = ActivityService.isCompleteSignersAchievements(
      activity
    )
    const isCompletePercent = ActivityService.isCompletePercentAchievement(
      activity
    )

    if (isCompleteSigned && isCompletePercent) {
      const {
        ots,
        hash,
        pathPdf,
        nameFilePdf,
        nameFileOts,
        pathOtsFile,
      } = await BlockChainServices.sign(crop, activity)

      const approvalRegisterSign = await ApprovalRegisterSingService.create({
        ots,
        hash,
        pathPdf,
        nameFilePdf,
        nameFileOts,
        pathOtsFile,
        activity,
      })

      activity.approvalRegister = approvalRegisterSign._id

      await ActivityService.changeStatus(activity, 'FINISHED')
      await CropService.removeActivities(activity, crop, 'done')
      await CropService.addActivities(activity, crop)
    }

    res.status(200).json(achievement)
  }

  /**
   * Download PDF to progress Activity.
   *
   * @param Request req
   * @param Response res
   */
  public async makePdf(req: Request, res: Response) {
    const { idActivity, idCrop } = req.params

    const activity = await ActivityService.findActivityById(idActivity)
    const crop = await Crop.findById(idCrop).populate('cropType')

    const pdf = await AchievementService.generatePdf(activity, crop)

    return res.status(200).json(pdf.publicPath)
  }
}

export default new AchievementsController()
