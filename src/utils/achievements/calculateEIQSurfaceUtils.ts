import { IAchievement } from '../../interfaces'
import { parseSuppliesWithEiqTotal } from '../supplies'
import { sumEIQInSupplies } from '../activities'

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

export const parseSuppliesWithEiqTotalInAchievements = (achievements = []) => {
  return achievements.map((achievement) => {
    const { supplies } = achievement
    const newSupplies = parseSuppliesWithEiqTotal(supplies, false)
    const eiq = sumEIQInSupplies(newSupplies)
    return {
      ...achievement,
      supplies: newSupplies,
      eiq
    }
  })
}

export const calculateEIQApplied = (quantity, unit, eiqTotal) => {
  return quantity * eiqTotal //Todo: determinar calculo segun unit
}

const reduceSumEIQ = (current, { eiq = 0 }) => current + eiq
export const sumEIQInAchievements = (list) => list.reduce(reduceSumEIQ, 0)
