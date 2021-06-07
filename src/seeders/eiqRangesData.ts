import { TEiqRanges, IEiqRangesDocument } from '../interfaces'

export const eiqRangesData: IEiqRangesDocument[] = [
  {
    type: TEiqRanges.VERY_LOW,
    range: {
      min: 0,
      max: 25
    }
  },
  {
    type: TEiqRanges.LOW,
    range: {
      min: 25,
      max: 50
    }
  },
  {
    type: TEiqRanges.MODERATE,
    range: {
      min: 50,
      max: 100
    }
  },
  {
    type: TEiqRanges.HIGH,
    range: {
      min: 100,
      max: 150
    }
  },
  {
    type: TEiqRanges.VERY_HIGH,
    range: {
      min: 150,
      max: 200
    }
  }
]
