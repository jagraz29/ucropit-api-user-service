import { calculateEIQSurfaceInAchievements, sumPercentInAchievements } from './../achievements/'

export const calculateEIQAndPorcentTotal = (activities, surface) => {
  const activitiesWithEIQAndPercentTotal = activities.map(activity => {
    const percentTotal = sumPercentInAchievements(activity.achievements)
    const eiq = calculateEIQSurfaceInAchievements(surface, activity.achievements)
    return {
      ...activity,
      percentTotal,
      eiq
    }
  })

  return activitiesWithEIQAndPercentTotal

}
