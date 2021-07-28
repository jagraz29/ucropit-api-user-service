import { calculateEIQApplied } from '../achievements/'
import { Numbers } from '../Numbers'

const sumEIQ = (current, { eiq }) => current + (eiq || 0)
export const sumEIQInActiveIngredients = (activeIngredients) =>
  activeIngredients.length ? activeIngredients.reduce(sumEIQ, 0) : undefined

export const parseSuppliesWithEiqTotal = (supplies) => {
  return supplies.map((supplyObject) => {
    const { supply, activeIngredients = [], eiqTotal, quantity } = supplyObject
    let currentEiqTotal = eiqTotal || undefined
    if (supply) {
      const supplyJSON = supply.toJSON ? supply.toJSON() : supply
      const { eiqTotal, activeIngredients = [] } = supplyJSON
      currentEiqTotal = eiqTotal || sumEIQInActiveIngredients(activeIngredients)
      supplyObject = {
        ...supplyObject,
        supply: {
          ...supplyJSON,
          eiqTotal:
            currentEiqTotal !== undefined
              ? Numbers.roundToTwo(currentEiqTotal)
              : undefined
        }
      }
    }
    if (activeIngredients.length) {
      currentEiqTotal = eiqTotal || sumEIQInActiveIngredients(activeIngredients)
      supplyObject = {
        ...supplyObject,
        eiqTotal:
          currentEiqTotal !== undefined
            ? Numbers.roundToTwo(currentEiqTotal)
            : undefined
      }
    }
    if (quantity && currentEiqTotal !== undefined) {
      const eiqApplied = calculateEIQApplied(quantity, currentEiqTotal)
      supplyObject = {
        ...supplyObject,
        eiq: Numbers.roundToTwo(eiqApplied)
      }
    }
    return supplyObject
  })
}
