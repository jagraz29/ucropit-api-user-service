import { TypeAgreement, CropTypes } from '../../interfaces'

export const sumActivitiesSurfacesByTypeAgreement = (
  activities,
  { cropType }
) => {
  let exploActivitiesSurfaces: number = 0
  let sustainActivitiesSurfaces: number = 0
  let seedUseActivitiesSurfaces: number = 0
  let responsibleUseActivitiesSurfaces: number = 0

  activities.map((activity) => {
    if (activity.typeAgreement.key === TypeAgreement.EXPLO) {
      exploActivitiesSurfaces += activity.surface
    }

    if (activity.typeAgreement.key === TypeAgreement.SUSTAIN) {
      sustainActivitiesSurfaces += activity.surface
    }

    if (
      activity.typeAgreement.key === TypeAgreement.SEED_USE &&
      (cropType.key === CropTypes.SOY || cropType.key === CropTypes.COTTON)
    ) {
      seedUseActivitiesSurfaces += activity.surface
    }

    if (activity.typeAgreement.key === TypeAgreement.RESPONSIBLE_USE) {
      responsibleUseActivitiesSurfaces += activity.surface
    }
  })

  return {
    exploActivitiesSurfaces,
    sustainActivitiesSurfaces,
    seedUseActivitiesSurfaces,
    responsibleUseActivitiesSurfaces
  }
}
