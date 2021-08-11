import {
  parseSuppliesWithEiqTotalInAchievements,
  sumEIQInAchievements,
  sumPercentInAchievements
} from '../achievements'
import { parseSuppliesWithEiqTotal } from '../supplies'
import { Numbers } from '../Numbers'

export const calculateEIQAndPercentTotal = (activities, lang) =>
  activities.map((activity) => calculateEiqOfActivity(activity, lang))

export const calculateEiqOfActivity = (activity, lang) => {
  const { achievements, supplies } = activity
  const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(supplies, lang)
  const achievementsWithEiq = parseSuppliesWithEiqTotalInAchievements(
    achievements,
    lang
  )
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
