import models from '../models'
import { SupplyTypeDocument } from '../models/supplyType'
const { SupplyType } = models

export class SupplyTypeRepository {
  /**
   * Get all supply types
   * @returns
   */
  public static async getAll(): Promise<SupplyTypeDocument[]> {
    return SupplyType.find({})
  }

  /**
   *
   * @param query
   * @returns
   */
  public static async getAllByQuery(query: any): Promise<SupplyTypeDocument[]> {
    return SupplyType.find(query).lean()
  }
  /**
   * Get SupplyType by ids.
   *
   * @param ids
   * @returns
   */
  public static async getByIds(ids: String[]): Promise<SupplyTypeDocument[]> {
    return SupplyType.find({ _id: { $in: ids } })
  }

  /**
   *Update One SupplyType
   * @param id
   * @param queryUpdate
   */
  public static async updateOne(id: string, queryUpdate): Promise<void> {
    await SupplyType.updateOne({ _id: id }, queryUpdate)
  }
}
