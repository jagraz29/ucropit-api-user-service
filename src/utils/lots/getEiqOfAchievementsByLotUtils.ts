import { IDataLot } from '../../interfaces'

export const getEiqOfAchievementsByLot = (lotId,activitiesWithEiq): IDataLot => {
  return activitiesWithEiq.reduce(
    (a,{ achievements }) => {
      const achievement = achievements.reduce((a,{ lots,eiq }) => {
        const lot = lots.find(({ _id }) => lotId.toString() === _id.toString())
        if (lot) return { eiq: a.eiq + eiq, count: a.count + 1 }
        return { eiq: 0, count: 0 }
      },{ eiq: 0, count: 0 })
      return { eiq: a.eiq + achievement.eiq, count: a.count + achievement.count }
    },{ eiq: 0, count: 0 })
}