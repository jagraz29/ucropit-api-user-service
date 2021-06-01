import models from '../models'

const { Achievement } = models

export class AchievementRepository {
  /**
   *
   * @param update
   * @param string id
   */
  static async updateAchievement(update, id: string): Promise<void> {
    return Achievement.updateOne({ _id: id }, { $set: update })
  }
}
