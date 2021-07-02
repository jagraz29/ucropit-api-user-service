import { calculateEIQApplied } from '../achievements/'

const sumEIQ = (current, { eiq = 0 }) => current + eiq
export const sumEIQInActiveIngredients = (activeIngredients) =>
  activeIngredients.reduce(sumEIQ, 0)

export const parseSuppliesWithEiqTotal = (supplies, isPlanning) => {
  return supplies.map((supplyObject) => {
    const {
      supply,
      activeIngredients = [],
      eiqTotal,
      quantity,
      total,
      unit
    } = supplyObject
    let newEiqTotal = eiqTotal || 0
    if (supply) {
      // Supply as product
      const supplyJSON = supply.toJSON ? supply.toJSON() : supply
      const { eiqTotal, activeIngredients = [] } = supplyJSON
      newEiqTotal =
        eiqTotal !== undefined
          ? eiqTotal
          : sumEIQInActiveIngredients(activeIngredients)
      supplyObject = {
        ...supplyObject,
        supply: {
          ...supplyJSON,
          eiqTotal: newEiqTotal
        }
      }
    }
    if (activeIngredients.length) {
      newEiqTotal =
        eiqTotal !== undefined
          ? eiqTotal
          : sumEIQInActiveIngredients(activeIngredients)
      supplyObject = {
        eiqTotal: newEiqTotal
      }
    }
    if (!isNaN(quantity * 1) && !isNaN(newEiqTotal * 1)) {
      const _quantity = isPlanning ? quantity : total
      const eiq = calculateEIQApplied(_quantity, unit, newEiqTotal)
      supplyObject = {
        ...supplyObject,
        eiq
      }
    }
    return supplyObject
  })
}
