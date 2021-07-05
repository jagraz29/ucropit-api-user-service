import { AchievementModel } from '../models'
import { IAchievementDocument, IAchievement } from '../interfaces'

export class AchievementRepository {
  /**
   *
   * @param update
   * @param string id
   */
  static async updateAchievement(
    update: Partial<IAchievement>,
    id: string
  ): Promise<IAchievementDocument | any> {
    return AchievementModel.updateOne({ _id: id }, { $set: update })
  }
  /**
   *
   * @param query
   * @param dataToUpdate
   *
   * @returns
   */
     public static async updateOneAchievement(
      query: any,
      dataToUpdate: Partial<IAchievement>
    ): Promise<IAchievementDocument | any > {
      return AchievementModel.updateOne(query, dataToUpdate)
    }
}
