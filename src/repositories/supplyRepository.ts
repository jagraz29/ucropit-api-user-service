import models from '../models'
const { Supply, ActiveIngredient } = models

class SupplyRepository {
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
   * @returns
   */
  public static async getSuppliesPaginated(query, limit, skip): Promise<any> {
    return Supply.find(query)
      .populate('typeId')
      .populate('activesPrinciples.activePrinciple')
      .limit(limit)
      .skip(skip)
      .lean({ virtuals: true })
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
   * @param queryUpdate
   */
  public static async updateOne(id: string, queryUpdate): Promise<void> {
    await Supply.updateOne({ _id: id }, queryUpdate)
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
}

export default SupplyRepository
