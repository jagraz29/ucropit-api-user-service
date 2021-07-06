import { EnvImpactIndexModel } from '../models'
import { IEnvImpactIndexDocument, IEnvImpactIndex } from '../interfaces'

export class envImpactIndexRepository {
  /**
   *
   * @param envImpactIndexIds
   *
   */
  public static async getEnvImpactIndexByIds(
    envImpactIndexIds: IEnvImpactIndex[]
  ): Promise<IEnvImpactIndexDocument[]> {
    return EnvImpactIndexModel.find({ _id: { $in: envImpactIndexIds } })
  }

  /**
   *
   * @param envImpactIndex
   *
   */
  public static async createAllEnvImpactIndex(
    envImpactIndex: IEnvImpactIndex[]
  ): Promise<IEnvImpactIndexDocument[]> {
    return EnvImpactIndexModel.insertMany(envImpactIndex)
  }
}
