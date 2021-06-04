import { Numbers } from '../'

/**
 * Get Achievement's.
 *
 * @param Array achievements
 * @param Array crop
 *
 * @returns Number
 */
export const getSupplies = (supplies): Object[] => {
  return supplies
    .map(({
      name,
      quantity: quantityParam,
      typeId: typeParam,
      unit: unitParam,
      total,
      supply }) => {
      let eiq = 0

      if (supply) {
        const { typeId, unit, brand, eiqTotal } = supply
        name = brand
        eiq = Numbers.roundToTwo(eiqTotal)
        typeParam = typeId
        unitParam = unit
      }
      return {
        name,
        eiq,
        quantity: quantityParam,
        unit: unitParam,
        type: typeParam,
        total
      }
    })
    .filter((item) => item)
}
