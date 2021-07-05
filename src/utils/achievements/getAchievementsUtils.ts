import { IAchievement } from '../../interfaces'
import { calculateEIQSurfaceAchievement } from '.'
import {
  getEvidencePdf,
  getEvidenceImage,
  getSuppliesAndTotalTypes,
  getSignerList
} from '../'

import { Numbers } from '../Numbers'

/**
 * Get Achievement's.
 *
 * @param Array achievements
 * @param Array crop
 *
 * @returns Number
 */
export const getAchievements = (achievements, members?): IAchievement[] => {
  return achievements
    .map((achievement) => {
      const { dateAchievement, lots, surface, signers, supplies, files, _id, envImpactIndice } =
        achievement
      const eiq = calculateEIQSurfaceAchievement(achievement)
      return {
        _id,
        dateAchievement,
        lots: lots,
        lotsQuantity: lots.length,
        surface,
        supplies: getSuppliesAndTotalTypes(supplies),
        suppliesList: supplies,
        eiq: Numbers.roundToTwo(eiq),
        envImpactIndice,
        signed: signers.length,
        signedIf: signers.filter(({ signed }) => signed).length,
        signers: getSignerList(signers, members),
        evidencesPdf: getEvidencePdf(files),
        evidencesImages: getEvidenceImage(files)
      }
    })
    .filter((item) => item)
}
