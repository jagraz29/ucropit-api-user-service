import { calculateCropVolumeUtils } from '../'

export const calculateTheoreticalPotentialUtils = (crops: any) => {
  let theoriticalPotential = 0

  crops.map(({ unitType: { key }, pay, surface }) => {
    let volume: number = calculateCropVolumeUtils(key,pay,surface)

    theoriticalPotential = theoriticalPotential + volume
  })

  return theoriticalPotential
}
