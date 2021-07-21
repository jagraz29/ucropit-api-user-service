import {
  parseSuppliesWithEiqTotalInAchievements,
  sumEIQInAchievements,
  sumPercentInAchievements
} from './../achievements/'
import { parseSuppliesWithEiqTotal } from '../supplies'
import { Numbers } from '../Numbers'

export const calculateEIQAndPorcentTotal = (activities) =>
  activities.map(calculateEiqOfActivity)

export const calculateEiqOfActivity = (activity) => {
  const { achievements, supplies } = activity
  const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(supplies)
  const achievementsWithEiq =
    parseSuppliesWithEiqTotalInAchievements(achievements)
  const percentTotal = sumPercentInAchievements(achievementsWithEiq)
  const eiqPlanned = sumEIQInSupplies(suppliesWithEiqTotal)
  const eiqApplied = sumEIQInAchievements(achievementsWithEiq)
  const currentEiq = eiqApplied ? eiqApplied : eiqPlanned
  return {
    ...activity,
    achievements: achievementsWithEiq,
    supplies: suppliesWithEiqTotal,
    percentTotal,
    eiq: currentEiq !== undefined ? Numbers.roundToTwo(currentEiq) : undefined
  }
}

const reduceSumEIQ = (current, { eiq }) => current + (eiq || 0)
export const sumEIQInSupplies = (list) => list.reduce(reduceSumEIQ, 0)
