import { calculateEIQApplied } from '../achievements/'
import { Numbers } from '../Numbers'

const sumEIQ = (current, { eiq }) => current + (eiq || 0)
export const sumEIQInActiveIngredients = (activeIngredients) =>
  activeIngredients.reduce(sumEIQ, 0)

export const parseSuppliesWithEiqTotal = (supplies) => {
  return supplies.map((supplyObject) => {
    const { supply, activeIngredients = [], eiqTotal, quantity } = supplyObject
    let currentEiqTotal = eiqTotal || 0
    if (supply) {
      const supplyJSON = supply.toJSON ? supply.toJSON() : supply
      const { eiqTotal, activeIngredients = [] } = supplyJSON
      currentEiqTotal = eiqTotal
        ? Numbers.roundToTwo(eiqTotal)
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
      currentEiqTotal = eiqTotal
        ? Numbers.roundToTwo(eiqTotal)
        : sumEIQInActiveIngredients(activeIngredients)
      supplyObject = {
        ...supplyObject,
        eiqTotal: Numbers.roundToTwo(currentEiqTotal)
      }
    }
    if (quantity && currentEiqTotal) {
      const eiqApplied = calculateEIQApplied(quantity, currentEiqTotal)
      supplyObject = {
        ...supplyObject,
        eiq: Numbers.roundToTwo(eiqApplied)
      }
    }
    return supplyObject
  })
}
