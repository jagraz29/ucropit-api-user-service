import { IAchievement } from '../../interfaces'
import { parseSuppliesWithEiqTotal } from '../supplies'

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
  const eiqTotalSupplies = supplies.reduce((a, { supply, total }) => {
    // console.log(supply)
    if (supply) return a + (supply.eiqTotal || 0) * Number(total)
    return 0
  }, 0)
  const eiqTotal = eiqTotalSupplies / Number(surface)
  return !Number.isNaN(eiqTotal) ? eiqTotal : 0
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

export const parseSuppliesWithEiqTotalInAchievements = (achievements) => {
  return achievements.map((achievement) => {
    const { supplies } = achievement
    return {
      ...achievement,
      supplies: parseSuppliesWithEiqTotal(supplies)
    }
  })
}
