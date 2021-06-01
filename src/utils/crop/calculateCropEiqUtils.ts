import { calculateEIQSurfaceAchievement } from '../'

export const calculateCropEiq = async (activities) => {
  let cropEiq: number = 0

  activities.map(({ achievements }) => {
    let activityEiq: number = 0

    achievements.map((achievement) => {
      let achievementEiq: number = calculateEIQSurfaceAchievement(achievement)

      activityEiq += achievementEiq
    })

    cropEiq += activityEiq
  })

  return cropEiq
}
