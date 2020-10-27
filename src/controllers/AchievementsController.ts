import { Request, Response } from 'express'
import {
  validateAchievement,
  validateFilesWithEvidences
} from '../utils/Validation'

import AchievementService from '../services/AchievementService'
import ActivityService from '../services/ActivityService'
import CropService from '../services/CropService'

import models from '../models'

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
  public async index (req: Request, res: Response) {
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
  public async show (req: Request, res: Response) {
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
  public async create (req: Request, res: Response) {
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

    await AchievementService.signUser(achievement, user)

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
  public async signAchievement (req: Request, res: Response) {
    const user = req.user
    const { id } = req.params

    let achievement = await AchievementService.findById(id)

    await AchievementService.signUser(achievement, user)

    achievement = await AchievementService.findById(id)

    res.status(200).json(achievement)
  }
}

export default new AchievementsController()
