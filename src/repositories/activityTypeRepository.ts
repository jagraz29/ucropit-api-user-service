import models from '../models'

const { ActivityType } = models

export class activityTypeRepository {
  /**
   *
   * @param query
   * @param populate
   *
   * @returns
   */
  public static async getActivityTypeById(id: string): Promise<any> {
    return ActivityType.findById(id)
  }
}
