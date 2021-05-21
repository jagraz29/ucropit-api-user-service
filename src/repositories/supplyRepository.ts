import models from '../models'
const { Supply, ActiveIngredient } = models

class SupplyRepository {
  /**
   *
   * @param String[] idsSupplyTypes
   */
  public static async getSuppliesBySupplyTypes(idsSupplyTypes: String[]) {
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
  public static async getOneActiveIngredient(query) {
    return ActiveIngredient.findOne(query)
  }
}

export default SupplyRepository
