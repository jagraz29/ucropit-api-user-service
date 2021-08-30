import models from '../models'
import { CountryDocument } from '../models/country'
const { Supply, SupplyType, ActiveIngredient, Country } = models

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
    tag?,
    sort?
  ): Promise<any> {
    return Supply.find(query)
      .populate('typeId')
      .populate('countryId')
      .populate('activeIngredients.activeIngredient')
      .limit(limit)
      .skip(skip)
      .sort(sort || {})
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
      .populate('activeIngredients.activeIngredient')

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

  /**
   *
   * @param item
   */
  public static async addSuppliesSeed(item): Promise<void> {
    const country: any = await Country.find({
      alpha3Code: item.alphacode
    }).lean()

    const supply = {
      ...item,
      alphaCode: country[0].alpha3Code,
      countryId: country[0]._id
    }

    return Supply.create(supply)
  }

  /**
   *
   * @param item
   */
  public static async addddSuppliesPhytosanitary(item): Promise<void> {
    const country: any = await Country.find({
      alpha3Code: item.alphacode
    }).lean()

    const supply = {
      ...item,
      alphaCode: country[0].alpha3Code,
      countryId: country[0]._id
    }

    return Supply.create(supply)
  }
}
