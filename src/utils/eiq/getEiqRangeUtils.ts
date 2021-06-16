import { IEiqRangesDocument, TEiqRanges } from '../../interfaces'

/**
 * Get Eiq Ranges.
 *
 * @param Number eiq
 * @param Array eiqRanges
 *
 * @returns String
 */
export const getEiqRange = (
  eiq,
  eiqRanges: IEiqRangesDocument[]
): TEiqRanges => {
  const eiqRange = eiqRanges.find(
    ({ range: { max, min } }) => eiq >= min && eiq <= max
  )
  if (eiqRange) return eiqRange.type
  return TEiqRanges.VERY_HIGH
}
