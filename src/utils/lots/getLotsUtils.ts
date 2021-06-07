import { Numbers } from '../Numbers'
import { getEiqOfAchievementsByLot } from '.'

export const getLots = (lots, activitiesWithEiq): Object[] => {
  return lots.map(
    ({ provinceName, _id: lotId, cityName, countryName, surface, image }) => {
      const { normal: path } = image || {}
      const imageLot = path
        ? `${process.env.BASE_URL}${path}`
        : process.env.IMAGE_LOT_DEFAULT

      const eiq: number = getEiqOfAchievementsByLot(lotId, activitiesWithEiq)
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

export const getLotsGroupByTag = (lots, activitiesWithEiq) => {
  return lots.map(({ data, tag }) => {
    const lots = getLots(data, activitiesWithEiq)
    return {
      tag,
      lots,
      lotsQuantity: lots.length ? lots.length : 0,
      surface: Numbers.roundToTwo(
        lots.reduce((prev, next) => prev + (next['surface'] || 0), 0)
      )
    }
  })
}
