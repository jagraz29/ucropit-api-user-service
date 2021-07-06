import { calculateEIQSurfaceAchievement } from '..'

export const calculateActivityEiq = (achievements) => {
  return achievements.reduce((acum, achievement) => {
    return acum + calculateEIQSurfaceAchievement(achievement)
  }, 0)
}
