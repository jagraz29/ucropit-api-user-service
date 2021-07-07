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
  const { achievements, supplies, surface } = activity
  const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(
    supplies,
    true,
    surface
  )
  const achievementsWithEiq =
    parseSuppliesWithEiqTotalInAchievements(achievements)
  const percentTotal = sumPercentInAchievements(achievementsWithEiq)
  const eiqPlanned = Numbers.roundToTwo(sumEIQInSupplies(suppliesWithEiqTotal))
  const eiqApplied = Numbers.roundToTwo(
    sumEIQInAchievements(achievementsWithEiq)
  )
  return {
    ...activity,
    achievements: achievementsWithEiq,
    supplies: suppliesWithEiqTotal,
    percentTotal,
    eiq: eiqApplied > 0 ? eiqApplied : eiqPlanned
  }
}

const reduceSumEIQ = (current, { eiq }) => current + (eiq || 0)
export const sumEIQInSupplies = (list) => list.reduce(reduceSumEIQ, 0)
