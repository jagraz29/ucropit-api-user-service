import {
  ActivityRepository,
  BadgeRepository,
  CropRepository
} from '../../repositories'
import {
  TypeActivities,
  TypeAgreement,
  CropTypes,
  BadgeTypes,
  IBadge
} from '../../interfaces'
import {
  calculateLegalLandUseBadge,
  calculateNoDeforestationBadge,
  calculateSustainablePrinciplesBadge,
  calculateLegalSeedUseSoyBadge,
  calculateLegalSeedUseCottonBadge,
  calculateResponsibleUsePhytosanitaryBadge,
} from '../../utils'

export const addCropBadgesReached = async ({
  _id,
  toMake,
  done,
  finished,
  cropType,
  surface,
  eiq,
}) => {
  const dataToFindActivities: any = {
    query: {
      _id: {
        $in: [...toMake, ...done, ...finished],
      },
    },
    populate: [{
      path: 'type',
      match: {
        tag: TypeActivities.ACT_AGREEMENTS,
      },
    },{
      path: 'typeAgreement',
      match: {
        'signers.signed': {
          $nin: [false],
        },
      },
    }],
  }

  let activities = await ActivityRepository.getActivities(dataToFindActivities)

  activities = activities.filter((activity) => activity.type && activity.typeAgreement)

  let typeAgreements: Array<any> = []

  let exploActivitiesSurfaces: number = 0
  let sustainActivitiesSurfaces: number = 0
  let seedUseActivitiesSurfaces: number = 0
  let responsibleUseActivitiesSurfaces: number = 0

  activities.map((activity) => {
    if(activity.typeAgreement.key === TypeAgreement.EXPLO){
      exploActivitiesSurfaces += activity.surface
    }

    if(activity.typeAgreement.key === TypeAgreement.SUSTAIN){
      sustainActivitiesSurfaces += activity.surface
    }

    if(
      activity.typeAgreement.key === TypeAgreement.SEED_USE &&
      (
        cropType.key === CropTypes.SOY ||
        cropType.key === CropTypes.COTTON
      )
    ){
      seedUseActivitiesSurfaces += activity.surface
    }

    if(activity.typeAgreement.key === TypeAgreement.RESPONSIBLE_USE){
      responsibleUseActivitiesSurfaces += activity.surface
    }

    typeAgreements.push(activity.typeAgreement)
  })

  const dataToFindBadges: any = {
    query: {},
  }

  const badges = await BadgeRepository.getBadges(dataToFindBadges)

  let badgesToAdd: Array<any> = []

  badges.map((badge) => {
    if(badge.type === BadgeTypes.LEGAL_LAND_USE){
      let allowBadge = calculateLegalLandUseBadge(exploActivitiesSurfaces, surface, badge)

      if(allowBadge){
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter((typeAgreement) => typeAgreement.key === TypeAgreement.EXPLO)[0]._id
        })
      }
    }

    if(badge.type === BadgeTypes.NO_DEFORESTATION){
      let allowBadge = calculateNoDeforestationBadge(sustainActivitiesSurfaces, surface, badge)

      if(allowBadge){
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter((typeAgreement) => typeAgreement.key === TypeAgreement.SUSTAIN)[0]._id
        })
      }
    }

    if(badge.type === BadgeTypes.SUSTAINABLE_PRINCIPLES){
      let allowBadge = calculateSustainablePrinciplesBadge(sustainActivitiesSurfaces, surface, badge)

      if(allowBadge){
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter((typeAgreement) => typeAgreement.key === TypeAgreement.SUSTAIN)[0]._id
        })
      }
    }

    if(badge.type === BadgeTypes.LEGAL_SEED_USE_SOY){
      let allowBadge = calculateLegalSeedUseSoyBadge(seedUseActivitiesSurfaces, surface, badge)

      if(allowBadge){
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter((typeAgreement) => typeAgreement.key === TypeAgreement.SEED_USE)[0]._id
        })
      }
    }

    if(badge.type === BadgeTypes.LEGAL_SEED_USE_COTTON){
      let allowBadge = calculateLegalSeedUseCottonBadge(seedUseActivitiesSurfaces, surface, badge)

      if(allowBadge){
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter((typeAgreement) => typeAgreement.key === TypeAgreement.SEED_USE)[0]._id
        })
      }
    }

    if(badge.type === BadgeTypes.RESPOSIBLE_USE_PHYTOSANITARY){
      let allowBadge = calculateResponsibleUsePhytosanitaryBadge(eiq, badge)

      if(allowBadge){
        badgesToAdd.push({
          badge: badge._id,
          typeAgreement: typeAgreements.filter((typeAgreement) => typeAgreement.key === TypeAgreement.RESPONSIBLE_USE)[0]._id
        })
      }
    }
  })

  const query: any = {
    _id
  }

  const dataToUpdate: any = {
    badges: badgesToAdd
  }

  await CropRepository.updateOneCrop(query, dataToUpdate)

  return

}
