import { IAchievement } from '../../interfaces'
import { parseSuppliesWithEiqTotal } from '../supplies'
import { sumEIQInSupplies } from '../activities'
import { Numbers } from '../Numbers'

/**
 * Calculate Achievement's EIQ Surface.
 *
 * @param Supply supply
 * @param number surfaceAchievement
 *
 * @returns Number
 */
export function calculateEIQSurfaceAchievement({
  supplies,
  surface
}: IAchievement) {
  const eiq = supplies.reduce((a, { supply, quantity, eiqTotal }) => {
    if (supply) {
      const eiqSupply = supply?.eiqTotal ?? eiqTotal
      return a + (eiqSupply || 0) * Number(quantity)
    }
    return 0
  }, 0)
  return Numbers.roundToTwo(eiq)
}

export const calculateEIQSurfaceInAchievements = (achievements) => {
  let eiqTotal = 0
  achievements.forEach((achievement) => {
    const { supplies, surface } = achievement
    const achievementDTO = {
      supplies,
      surface
    } as IAchievement
    eiqTotal += calculateEIQSurfaceAchievement(achievementDTO)
  })
  return eiqTotal
}

export const parseSuppliesWithEiqTotalInAchievements = (achievements = []) => {
  return achievements.map((achievement) => {
    const { supplies } = achievement
    const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(supplies)
    const eiqApplied = Numbers.roundToTwo(
      sumEIQInSupplies(suppliesWithEiqTotal)
    )
    return {
      ...achievement,
      supplies: suppliesWithEiqTotal,
      eiq: eiqApplied > 0 ? eiqApplied : undefined
    }
  })
}

export const calculateEIQApplied = (quantity, eiqTotal) => quantity * eiqTotal

const reduceSumEIQ = (current, { eiq }) => current + (eiq || 0)
export const sumEIQInAchievements = (list) => list.reduce(reduceSumEIQ, 0)
