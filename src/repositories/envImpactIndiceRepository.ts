import { EnvImpactIndiceModel } from '../models'
import { IEnvImpactIndiceDocument, IEnvImpactIndice } from '../interfaces'

export class envImpactIndiceRepository {
  /**
   *
   * @param EnvImpactIndiceIds
   *
   */
   public static async getEnvImpactIndicesByIds (EnvImpactIndiceIds: IEnvImpactIndice[]): Promise<IEnvImpactIndiceDocument[]> {
    return EnvImpactIndiceModel.find({_id: { $in:EnvImpactIndiceIds }})
  }

  /**
   *
   * @param envImpactIndices
   *
   */
   public static async createAllEnvImpactIndice (envImpactIndices: IEnvImpactIndice[]): Promise<IEnvImpactIndiceDocument[]> {
    return EnvImpactIndiceModel.insertMany(envImpactIndices)
  }
}
