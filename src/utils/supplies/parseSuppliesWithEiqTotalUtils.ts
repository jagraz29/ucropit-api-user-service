import { calculateEIQApplied } from '../achievements/'
import { Numbers } from '../Numbers'

const sumEIQ = (current, { eiq }) => current + (eiq || 0)
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
    let currentEiqTotal = eiqTotal || 0
    if (supply) {
      const supplyJSON = supply.toJSON ? supply.toJSON() : supply
      const { eiqTotal, activeIngredients = [] } = supplyJSON
      currentEiqTotal =
        eiqTotal !== undefined
          ? eiqTotal
          : sumEIQInActiveIngredients(activeIngredients)
      supplyObject = {
        ...supplyObject,
        supply: {
          ...supplyJSON,
          eiqTotal: Numbers.roundToTwo(currentEiqTotal)
        }
      }
    }
    if (activeIngredients.length) {
      currentEiqTotal =
        eiqTotal !== undefined
          ? eiqTotal
          : sumEIQInActiveIngredients(activeIngredients)
      supplyObject = {
        eiqTotal: Numbers.roundToTwo(currentEiqTotal)
      }
    }
    if (quantity) {
      const quantityOrTotal = isPlanning ? quantity : total
      const eiq = calculateEIQApplied(quantityOrTotal, unit, currentEiqTotal)
      supplyObject = {
        ...supplyObject,
        eiq
      }
    }
    return supplyObject
  })
}
