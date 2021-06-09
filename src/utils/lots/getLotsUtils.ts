import { Numbers } from '../Numbers'
import { getEiqOfAchievementsByLot } from '.'
import { getEiqRange } from '..'
import { IEiqRangesDocument } from '../../interfaces'

export const getLots = (lots, activitiesWithEiq, eiqRanges: IEiqRangesDocument[]): Object[] => {
  return lots.map(
    ({ provinceName, _id: lotId, cityName, countryName, surface, image }) => {
      const { normal: path } = image || {}
      const imageLot = path
        ? `${process.env.BASE_URL}${path}`
        : process.env.IMAGE_LOT_DEFAULT

      const eiq: number = Numbers.roundToTwo(getEiqOfAchievementsByLot(lotId, activitiesWithEiq))
      return {
        provinceName,
        cityName,
        countryName,
        surface,
        eiq: {
          quantity: eiq,
          range: getEiqRange(eiq,eiqRanges)
        },
        image: imageLot
      }
    }
  )
}

export const getLotsGroupByTag = (lots, activitiesWithEiq, eiqRanges: IEiqRangesDocument[]) => {
  return lots.map(({ data, tag }) => {
    const lots = getLots(data, activitiesWithEiq, eiqRanges)
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
