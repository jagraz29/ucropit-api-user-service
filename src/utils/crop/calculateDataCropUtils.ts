import util from 'util'
import { Numbers } from '../Numbers'
import { calculateCropVolumeUtils } from './calculateCropVolumeUtils'

export const calculateDataCropUtils = ({
    surface,
    pay: payEntry,
    dateCrop,
    name,
    activities,
    lots,
    company,
    unitType,
    cropType: { key: cropTypeKey }
  }): Object => {
  const pay = payEntry ?? 0
  const { key: keyUnitType, name: nameUnitType } = unitType || {}
  // console.log(util.inspect(lots, { showHidden: false, depth: null }))
  return {
    surface,
    volume: Numbers.roundToTwo(
      calculateCropVolumeUtils(keyUnitType, pay, surface)
    ),
    pay,
    dateCrop,
    name,
    cropTypeKey,
    company
  }
}
