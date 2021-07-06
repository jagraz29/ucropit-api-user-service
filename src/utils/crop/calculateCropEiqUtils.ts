import { calculateActivityEiq } from '../'

export const calculateCropEiq = (activities) => {
  return activities.reduce((a, { achievements }) => {
    return a + calculateActivityEiq(achievements)
  }, 0)
}
