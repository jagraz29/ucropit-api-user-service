import models from '../models'
import { TypeActivities } from '../interfaces/activities/TypeActivities.enum'
const { Supply, ActiveIngredient } = models

export class SupplyRepository {
  /**
   *
   * @param query
   * @returns
   */
  public static async getSupply(query): Promise<any> {
    return Supply.findOne(query)
  }

  /**
   * @function getSuppliesPaginated
   * @param query
   * @param limit
   * @param skip
   * @param tag
   * @returns
   */
  public static async getSuppliesPaginated(
    query,
    limit,
    skip,
    tag?
  ): Promise<any> {
    let suppliesPaginated = Supply.find(query)
      .populate('typeId')
      .populate('countryId')
      .populate('activesPrinciples.activePrinciple')
      .limit(limit)
      .skip(skip)

    if (tag === TypeActivities.ACT_SOWING) {
      suppliesPaginated = suppliesPaginated.sort({ typeId: -1 })
      return suppliesPaginated.lean({ virtuals: true })
    }

    return suppliesPaginated.lean({ virtuals: true })
  }
  /**
   *
   * @param String[] idsSupplyTypes
   */
  public static async getSuppliesBySupplyTypes(
    idsSupplyTypes: string[]
  ): Promise<any> {
    const supplies = await Supply.find({
      typeId: {
        $in: idsSupplyTypes
      }
    })
      .populate('typeId')
      .populate('activesPrinciples.activePrinciple')

    return supplies.length ? supplies : null
  }

  /**
   *
   * @param id
   * @param queryUpdate
   */
  public static async updateOne(id: string, queryUpdate): Promise<void> {
    await Supply.updateOne({ _id: id }, queryUpdate)
  }

  /**
   *
   * @param typeId
   * @param queryUpdate
   */
  public static async updateOneByTypeId(
    typeId: string,
    queryUpdate
  ): Promise<void> {
    await Supply.updateOne({ typeId: typeId }, queryUpdate)
  }

  /**
   *
   * @param typeIds
   * @param queryUpdate
   */
  public static async updateManyByTypeId(
    typeIds: string[],
    queryUpdate
  ): Promise<void> {
    await Supply.updateMany({ typeId: { $in: typeIds } }, queryUpdate)
  }

  /**
   *
   * @param query
   *
   * @returns
   */
  public static async getOneActiveIngredient(query): Promise<any> {
    return ActiveIngredient.findOne(query)
  }

  /**
   * get count of all supplies
   * @param query
   * @returns number
   */
  public static async count(query) {
    const count = await Supply.countDocuments(query)
    return count
  }
}
