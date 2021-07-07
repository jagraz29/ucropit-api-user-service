import { calculateEIQApplied } from '../achievements/'
import { Numbers } from '../Numbers'

const sumEIQ = (current, { eiq }) => current + (eiq || 0)
export const sumEIQInActiveIngredients = (activeIngredients) =>
  activeIngredients.reduce(sumEIQ, 0)

export const parseSuppliesWithEiqTotal = (supplies, isPlanning?, surface?) => {
  return supplies.map((supplyObject) => {
    const {
      supply,
      activeIngredients = [],
      eiq,
      eiqTotal,
      quantity,
      total
    } = supplyObject
    let currentEiqTotal = eiqTotal || eiq || null
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
          eiqTotal: activeIngredients.length
            ? Numbers.roundToTwo(currentEiqTotal)
            : null
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
    if (quantity && surface && currentEiqTotal) {
      const quantityOrTotal = isPlanning ? quantity : total
      const eiqApplied = calculateEIQApplied(
        quantityOrTotal,
        surface,
        currentEiqTotal
      )
      supplyObject = {
        ...supplyObject,
        eiq: eiq ? eiq : Numbers.roundToTwo(eiqApplied)
      }
    } else {
      supplyObject = {
        ...supplyObject,
        eiq: null
      }
    }
    return supplyObject
  })
}
