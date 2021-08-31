import models from '../models'
const { Supply, ActiveIngredient, Country } = models
import {
  Supply as SupplyInterfaces,
  ActiveIngredient as ActiveIngredientInterfaces,
  ActiveIngredientUnified as ActiveIngredientStandard
} from '../interfaces/supplies'
import {
  createListSimpleActiveIngredients,
  createCompoundActiveIngredients
} from '../utils/'
import { activeIngredientUnified } from '../types/activeIngredients'

export class SupplyRepository {
  /**
   *
   * @param query
   * @returns
   */
  public static async getSupply(query) {
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
  public static async addSuppliesSeed(item) {
    const country: any = await Country.find({
      alpha3Code: item.alphaCode
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
  public static async addddSuppliesPhytosanitary(item) {
    const country: any = await Country.find({
      alpha3Code: item.alphaCode
    }).lean()

    const supplyInterfaces: SupplyInterfaces = {
      name: item.name.trim(),
      company: item.company,
      code: item.code,
      typeId: item.typeId
    }

    if (
      item.composition_0.trim() !== '' &&
      item.composition_1.trim() === '' &&
      item.composition_2.trim() === '' &&
      item.composition_3.trim() === '' &&
      item.composition_4.trim() === ''
    ) {
      const supply = {
        ...supplyInterfaces,
        compositon: item.composition_0
      }

      const activeIngredientStandard: ActiveIngredientStandard =
        activeIngredientUnified.find(
          (ingredient) => supply.name === ingredient.active_principle.trim()
        )

      if (activeIngredientStandard) {
        const activeIngredientInterfaces: ActiveIngredientInterfaces =
          await this.getOneActiveIngredient({
            'name.es': activeIngredientStandard.active_ingredient_unified
          })

        if (activeIngredientInterfaces) {
          const ingredientsActive = createListSimpleActiveIngredients(
            supply,
            activeIngredientInterfaces
          )

          const data = {
            ...supply,
            unit: item.unit,
            brand: item.brand,
            alphaCode: country[0].alpha3Code,
            countryId: country[0]._id,
            activeIngredients: ingredientsActive
          }

          return Supply.create(data)
        }
      }
    } else {
      let composition = ''
      if (item.composition_1.trim() !== '') {
        composition = item.composition_0.concat('+', item.composition_1)
      }
      if (item.composition_2.trim() !== '') {
        composition = composition.concat('+', item.composition_2)
      }
      if (item.composition_3.trim() !== '') {
        composition = composition.concat('+', item.composition_3)
      }
      if (item.composition_4.trim() !== '') {
        composition = composition.concat('+', item.composition_4)
      }

      const supply = {
        ...supplyInterfaces,
        compositon: composition
      }

      const ingredientsActive = await createCompoundActiveIngredients(supply)

      const data = {
        ...supply,
        unit: item.unit,
        brand: item.brand,
        alphaCode: country[0].alpha3Code,
        countryId: country[0]._id,
        activeIngredients: ingredientsActive
      }

      return Supply.create(data)
    }
  }
}
