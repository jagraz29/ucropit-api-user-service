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
   * @param query
   * @param populate
   *
   * @returns
   */
  public static async getEnvImpactIndexById(
    id: string
  ): Promise<IEnvImpactIndexDocument> {
    return EnvImpactIndexModel.findById(id)
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

  /**
   *
   * @param envImpactIndex
   *
   */
  public static async createEnvImpactIndex(
    envImpactIndex: IEnvImpactIndex
  ): Promise<IEnvImpactIndexDocument> {
    return EnvImpactIndexModel.create(envImpactIndex)
  }
  /**
   *
   * @param query
   * @param dataToUpdate
   *
   * @returns
   */
  public static async updateOneEnvImpactIndex(
    query: any,
    dataToUpdate: any
  ): Promise<any> {
    return EnvImpactIndexModel.updateOne(query, dataToUpdate)
  }
}
