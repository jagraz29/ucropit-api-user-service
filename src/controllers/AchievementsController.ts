import { Request, Response } from 'express'
import models from '../models'
import { AchievementDocument } from '../models/achievement'

const Achievement = models.Achievement

class AchievementsController {

  public async index (req: Request, res: Response) {
        // TODO: Implement
  }

  public async create (req: Request, res: Response) {
    // TODO: Implement
    console.log(req)
  }

}

export default new AchievementsController()
