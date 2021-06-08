import { AchievementModel } from '../models'
import { IAchievementDocument } from '../interfaces'

export class AchievementRepository {
  /**
   *
   * @param update
   * @param string id
   */
  static async updateAchievement(update: Partial<IAchievementDocument>, id: string): Promise<IAchievementDocument | any > {
    return AchievementModel.updateOne({ _id: id }, { $set: update })
  }
}
