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
      ActivityService.changeStatus(activity, 'DONE')

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
}

export default new AchievementsController()
