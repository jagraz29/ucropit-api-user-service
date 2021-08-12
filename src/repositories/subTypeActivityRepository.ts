import { SubTypeActivityModel } from '../models'
import { ISubTypeActivity, ISubTypeActivityDocument } from '../interfaces'

export class SubTypeActivityRepository {
  public static async getAll(): Promise<ISubTypeActivityDocument[]> {
    return SubTypeActivityModel.find()
  }

  /**
   *
   * @param subTypeActivities
   *
   * @returns
   */
  public static async createAll(
    subTypeActivities: ISubTypeActivity[]
  ): Promise<ISubTypeActivityDocument[]> {
    return SubTypeActivityModel.insertMany(subTypeActivities)
  }
}
