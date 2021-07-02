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
  const newSupplies = parseSuppliesWithEiqTotal(supplies, true)
  const newAchievements = parseSuppliesWithEiqTotalInAchievements(achievements)
  const percentTotal = sumPercentInAchievements(newAchievements)
  const eiqPlanned = Numbers.roundToTwo(sumEIQInSupplies(newSupplies))
  const eiqApplied = Numbers.roundToTwo(sumEIQInAchievements(newAchievements))
  return {
    ...activity,
    achievements: newAchievements,
    supplies: newSupplies,
    percentTotal,
    eiqApplied,
    eiqPlanned,
    eiq: eiqApplied || eiqPlanned
  }
}

const reduceSumEIQ = (current, { eiq = 0 }) => current + eiq
export const sumEIQInSupplies = (list) => list.reduce(reduceSumEIQ, 0)
