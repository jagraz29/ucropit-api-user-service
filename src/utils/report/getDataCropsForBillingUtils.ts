import { flatten } from 'lodash'
import moment from 'moment'

const rolesAdvisorPromoter = ['PRODUCER_ADVISER_ENCOURAGED']

export const getDataCropsForBilling = (crops) => {
  const dataCropsBilling = flatten(
    crops.map((crop) => {
      return flatten(
        crop.activities.map((activity) => {
          if (activityHasListAchievement(activity)) {
            return dataCropBillingAchievement(activity, crop)
          } else {
            return dataCropBillingActivity(activity, crop)
          }
        })
      )
    })
  )

  return dataCropsBilling
}

const dataCropBillingAchievement = (activity, crop) => flatten(activity.achievements.map((achievement) => parseDataCropBilling(achievement, crop)))

const dataCropBillingActivity = (activity, crop) => parseDataCropBilling(activity, crop)

const parseDataCropBilling = (activity, crop) => {
    return {
        cuit: crop.company?.identifier,
        business_name: crop.company.name,
        crop: crop.cropType.name.es,
        crop_name: crop.name,
        responsible: getMembersWithRol(crop),
        surface_total: crop.surface,
        total_surface_signed_sowing: activity.surface,
        date_sign_achievement_by_lot_sowing: lastDateSign(activity)
    }
}

const activityHasListAchievement = (activity): boolean => {
  return activity.achievements.length > 0
}

const getMembersWithRol = (crop) => {
  return crop.members
    .filter((member) => rolesAdvisorPromoter.includes(member.type))
    .map((member) => `${member.identifier} Asesor promotor,`)
    .join('-')
}

const lastDateSign = (item) => {
  const signerSigned = item.signers.filter((signer) => signer.signed)
  const lastSigned = signerSigned.length > 0 ? signerSigned.pop() : null

  return lastSigned ? moment(lastSigned.dateSigned).format('DD/MM/YYYY') : ''
}
