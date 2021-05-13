import { calculateCropVolumeUtils } from '../'

export const calculateTheoreticalPotentialUtils = (crops: any) => {
  let theoriticalPotential = 0

  crops.map(({ unitType, pay, surface }) => {
  	if(!unitType) return

  	const key = unitType.key

    let volume: number = calculateCropVolumeUtils(key, pay, surface)

    theoriticalPotential = theoriticalPotential + volume
  })

  return theoriticalPotential
}
