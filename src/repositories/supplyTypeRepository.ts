import models from '../models'
import { SupplyTypeDocument } from '../models/supplyType'
const { SupplyType } = models

export class SupplyTypeRepository {
  /**
   * Get all supply types
   * @function getAll
   * @returns
   */
  public static async getAll(): Promise<SupplyTypeDocument[]> {
    return SupplyType.find({})
  }

  /**
   * @function getAllByQuery
   * @param query
   * @returns
   */
  public static async getAllByQuery(query: any): Promise<SupplyTypeDocument[]> {
    return SupplyType.find(query).lean()
  }

  /**
   * @function findOneByQuery
   * @param query
   * @returns
   */
  public static async findOneByQuery(
    query: any
  ): Promise<SupplyTypeDocument[]> {
    if (Object.keys(query).length === 0) return null
    return SupplyType.findOne(query).lean()
  }
  /**
   * Get SupplyType by ids.
   * @function getByIds
   * @param ids
   * @returns
   */
  public static async getByIds(ids: String[]): Promise<SupplyTypeDocument[]> {
    return SupplyType.find({ _id: { $in: ids } })
  }

  /**
   * Get SupplyType by codes.
   * @function getByCodes
   * @param codes
   * @returns
   */
  public static async getByCodes(
    codes: String[]
  ): Promise<SupplyTypeDocument[]> {
    return SupplyType.find({ code: { $in: codes } })
  }

  /**
   * Update One SupplyType
   * @param id
   * @param queryUpdate
   */
  public static async updateOne(id: string, queryUpdate): Promise<void> {
    await SupplyType.updateOne({ _id: id }, queryUpdate)
  }
}
