import { Achievement } from '../../interfaces'
import { calculateEIQSurfaceAchievement } from '.'
import { Numbers } from '../Numbers'

/**
 * Get Achievement's.
 *
 * @param Array achievements
 * @param Array crop
 *
 * @returns Number
 */
export const getAchievements = (achievements): Achievement[] => {
  return achievements
    .map((achievement) => {
      const {
          dateAchievement,
            lots,
            surface,
            signers,
            supplies,
            _id
        } = achievement
      const eiq = calculateEIQSurfaceAchievement(achievement)
      return {
        _id,
        dateAchievement,
        lots: lots,
        lotsQuantity: lots.length,
        surface,
        supplies,
        eiq: Numbers.roundToTwo(eiq),
        signed: signers.length,
        signedIf: signers.filter(({ signed }) => signed).length
      }
    })
    .filter((item) => item)
}
