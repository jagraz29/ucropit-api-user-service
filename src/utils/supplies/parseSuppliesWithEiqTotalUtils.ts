const sumEIQ = (current, { eiq = 0 }) => current + eiq
export const sumEIQInActiveIngredients = (activeIngredients) =>
  activeIngredients.reduce(sumEIQ, 0)

export const parseSuppliesWithEiqTotal = (supplies) => {
  return supplies.map((supplyObject) => {
    const { supply, activeIngredients = [], eiqTotal } = supplyObject
    if (supply) {
      const supplyJSON = supply.toJSON ? supply.toJSON() : supply
      const { eiqTotal, activeIngredients = [] } = supplyJSON
      supplyObject = {
        ...supplyObject,
        supply: {
          ...supplyJSON,
          eiqTotal:
            eiqTotal !== undefined
              ? eiqTotal
              : sumEIQInActiveIngredients(activeIngredients)
        }
      }
    }
    if (activeIngredients.length) {
      supplyObject = {
        eiqTotal:
          eiqTotal !== undefined
            ? eiqTotal
            : sumEIQInActiveIngredients(activeIngredients)
      }
    }
    return supplyObject
  })
}
