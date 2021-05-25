import { Numbers } from '../Numbers'
import { getEiqOfAchievementsByLot } from '.'

export const getLots = (lots,activitiesWithEiq): Object[] => {
  return lots.map(
    ({
       provinceName,
      _id: lotId,
       cityName,
       countryName,
       surface,
       image
     }) => {
      const { normal: path } = image || {}
      const imageLot = path ? `${process.env.BASE_URL}${process.env.DIR_STORAGE}${path}` : null
      const eiq: number = getEiqOfAchievementsByLot(lotId,activitiesWithEiq)
      return {
        provinceName,
        cityName,
        countryName,
        surface,
        eiq: Numbers.roundToTwo(eiq),
        image: imageLot
      }
    }
  )
}
