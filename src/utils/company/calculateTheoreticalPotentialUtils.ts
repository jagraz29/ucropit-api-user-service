import { calculateCropVolumeUtils } from '../'

export const calculateTheoreticalPotentialUtils = (crops: any) => {
  let theoriticalPotential = 0

  crops.map(({ unitType, pay, surface }) => {
    let volume = 0
    if (unitType && typeof unitType === 'object') {
      const { key } = unitType
      volume = calculateCropVolumeUtils(key, pay, surface)
    }
    theoriticalPotential = theoriticalPotential + volume
  })

  return theoriticalPotential
}
