import { __, setLocale } from 'i18n'
import { calculateEIQApplied } from '../achievements/'
import { Numbers } from '../Numbers'
import { parseLangLocal } from '../../utils/Locales'

const sumEIQ = (current, { eiq }) => current + (eiq || 0)
export const sumEIQInActiveIngredients = (activeIngredients) =>
  activeIngredients.length ? activeIngredients.reduce(sumEIQ, 0) : undefined

export const parseSuppliesWithEiqTotal = (supplies, lang) => {
  return supplies.map((supplyObject) => {
    const {
      supply,
      activeIngredients = [],
      eiqTotal,
      quantity,
      typeId
    } = supplyObject
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

    if (typeof typeId === 'object') {
      const typeIdJSON = typeId.toJSON ? typeId.toJSON() : typeId
      setLocale(lang || 'es')
      const supplyTypesCodes = __('supply_types.codes') as unknown as object
      supplyObject.typeId = {
        ...typeIdJSON,
        codeLabel: parseLangLocal(supplyTypesCodes, typeId.code, typeId.name)
      }
    }

    return supplyObject
  })
}
