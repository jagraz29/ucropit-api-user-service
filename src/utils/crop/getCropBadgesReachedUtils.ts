import { TypeAgreement, CropTypes, BadgeTypes } from '../../interfaces'
import {
  calculateLegalLandUseBadge,
  calculateNoDeforestationBadge,
  calculateSustainablePrinciplesBadge,
  calculateLegalSeedUseSoyBadge,
  calculateLegalSeedUseCottonBadge,
  calculateResponsibleUsePhytosanitaryBadge
} from '../../utils'

export const getCropBadgesReached = (
  typeAgreements,
  badges,
  {
    exploActivitiesSurfaces,
    sustainActivitiesSurfaces,
    seedUseActivitiesSurfaces,
    responsibleUseActivitiesSurfaces
  },
  { cropType, surface },
  cropEiq
) => {
  const badgesToAdd: Array<any> = []

  badges.map((badge) => {
    if (badge.type === BadgeTypes.LEGAL_LAND_USE) {
      const allowBadge = calculateLegalLandUseBadge(
        exploActivitiesSurfaces,
        surface,
        badge
      )

      if (allowBadge) {
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter(
            (typeAgreement) => typeAgreement.key === TypeAgreement.EXPLO
          )[0]._id,
          surfaceTotal: exploActivitiesSurfaces
        })
      }
    }

    if (badge.type === BadgeTypes.NO_DEFORESTATION) {
      const allowBadge = calculateNoDeforestationBadge(
        sustainActivitiesSurfaces,
        surface,
        badge
      )

      if (allowBadge) {
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter(
            (typeAgreement) => typeAgreement.key === TypeAgreement.SUSTAIN
          )[0]._id,
          surfaceTotal: sustainActivitiesSurfaces
        })
      }
    }

    if (badge.type === BadgeTypes.SUSTAINABLE_PRINCIPLES) {
      const allowBadge = calculateSustainablePrinciplesBadge(
        sustainActivitiesSurfaces,
        surface,
        badge
      )

      if (allowBadge) {
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter(
            (typeAgreement) => typeAgreement.key === TypeAgreement.SUSTAIN
          )[0]._id,
          surfaceTotal: sustainActivitiesSurfaces
        })
      }
    }

    if (
      cropType.key === CropTypes.SOY &&
      badge.type === BadgeTypes.LEGAL_SEED_USE_SOY
    ) {
      const allowBadge = calculateLegalSeedUseSoyBadge(
        seedUseActivitiesSurfaces,
        surface,
        badge
      )

      if (allowBadge) {
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter(
            (typeAgreement) => typeAgreement.key === TypeAgreement.SEED_USE
          )[0]._id,
          surfaceTotal: seedUseActivitiesSurfaces
        })
      }
    }

    if (
      cropType.key === CropTypes.COTTON &&
      badge.type === BadgeTypes.LEGAL_SEED_USE_COTTON
    ) {
      const allowBadge = calculateLegalSeedUseCottonBadge(
        seedUseActivitiesSurfaces,
        surface,
        badge
      )

      if (allowBadge) {
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter(
            (typeAgreement) => typeAgreement.key === TypeAgreement.SEED_USE
          )[0]._id,
          surfaceTotal: seedUseActivitiesSurfaces
        })
      }
    }

    if (badge.type === BadgeTypes.RESPOSIBLE_USE_PHYTOSANITARY) {
      const allowBadge = calculateResponsibleUsePhytosanitaryBadge(
        cropEiq,
        badge
      )

      if (allowBadge) {
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter(
            (typeAgreement) =>
              typeAgreement.key === TypeAgreement.RESPONSIBLE_USE
          )[0]._id
        })
      }
    }
  })

  return badgesToAdd
}
