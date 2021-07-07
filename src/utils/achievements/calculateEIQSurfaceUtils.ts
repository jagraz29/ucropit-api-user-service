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
  const eiqTotalSupplies = supplies.reduce((a, { supply, total, eiqTotal }) => {
    if (supply) {
      const eiqSupply = supply?.eiqTotal ?? eiqTotal
      return a + (eiqSupply || 0) * Number(total)
    }
    return 0
  }, 0)
  const eiqTotal = eiqTotalSupplies / Number(surface)
  return Numbers.roundToTwo(!Number.isNaN(eiqTotal) ? eiqTotal : 0)
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
    const { supplies, surface, eiq } = achievement
    const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(
      supplies,
      false,
      surface
    )
    const eiqApplied = Numbers.roundToTwo(
      sumEIQInSupplies(suppliesWithEiqTotal)
    )
    return {
      ...achievement,
      supplies: suppliesWithEiqTotal,
      eiq: eiq ? eiq : eiqApplied ? eiqApplied : null
    }
  })
}

export const calculateEIQApplied = (quantity, surface, eiqTotal) => {
  return (quantity * eiqTotal) / surface
}

const reduceSumEIQ = (current, { eiq }) => current + (eiq || 0)
export const sumEIQInAchievements = (list) => list.reduce(reduceSumEIQ, 0)
