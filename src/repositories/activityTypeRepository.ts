import models from '../models'
import { ActivityTypeDocument } from '../models/activityType'
const { ActivityType } = models

export class activityTypeRepository {
  /**
   * Get all activity types
   */
  public static async getAll(): Promise<ActivityTypeDocument[]> {
    return ActivityType.find({}).lean()
  }
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
