import { Numbers } from '../Numbers'
import { calculateCropVolumeUtils } from './calculateCropVolumeUtils'
import { getLots, getLotsGroupByTag } from '../lots'

export const calculateDataCropUtils = (
  {
    surface,
    pay: payEntry,
    dateCrop,
    name,
    activities,
    lots,
    company,
    badges,
    unitType,
    data,
    cropType: { key: cropTypeKey }
  },
  activitiesWithEiq
): Object => {
  const pay = payEntry ?? 0
  let eiq: number = 0
  const { key: keyUnitType, name: nameUnitType } = unitType || {}
  eiq = activitiesWithEiq.reduce((a, b) => a + b.eiq, 0)

  return {
    surface,
    volume: Numbers.roundToTwo(
      calculateCropVolumeUtils(keyUnitType, pay, surface)
    ),
    pay,
    dateCrop,
    name,
    badges,
    eiq: Numbers.roundToTwo(eiq),
    cropTypeKey,
    company,
    activities,
    lotsQuantity: lots.length ? lots[0].data.length : 0,
    lots: lots.length ? getLots(lots[0].data, activitiesWithEiq) : [],
    lotsGroupByTag: lots.length
      ? getLotsGroupByTag(lots, activitiesWithEiq)
      : []
  }
}
