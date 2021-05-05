import { calculateCropVolumeUtils } from '../'

export const calculateTheoreticalPotentialUtils = (crops: any) => {
  let theoriticalPotential = 0

  crops.map((crop) => {
    let volume: number = calculateCropVolumeUtils(
      crop.unitType.key,
      crop.pay,
      crop.surface
    )

    theoriticalPotential = theoriticalPotential + volume
  })

  return theoriticalPotential
}
