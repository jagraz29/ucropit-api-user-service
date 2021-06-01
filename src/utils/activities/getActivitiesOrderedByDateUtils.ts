import moment from 'moment'
import { calculateCropVolumeUtils, Numbers } from '../'
import {
  TypeActivitiesWithAchievements,
  TypeActivitiesWithOutAchievements,
  Achievement,
  TypeActivities
} from '../../interfaces'
import { getAchievements } from '../achievements'

export const getActivitiesOrderedByDateUtils = ({ activities }) => {
  const activitiesRes = activities
    .map(
      ({
        _id,
        achievements,
        type: { tag: TypeActivity },
        signers,
        name,
        lots,
        surface,
        storages,
        dateStart,
        dateEnd,
        typeAgreement,
        supplies,
        pay: payEntry,
        dateObservation,
        status,
        unitType
      }) => {
        let percent: number = 0
        let eiq: number = 0
        let achievementsWithEiq: Achievement[] = []
        const pay = payEntry ?? 0
        const { key: keyUnitType, name: nameUnitType } = unitType || {}

        if (TypeActivity === TypeActivities.ACT_AGREEMENTS) {
          return null
        }

        achievementsWithEiq = getAchievements(achievements)
        eiq = achievementsWithEiq.length
          ? achievementsWithEiq.reduce((a, b) => a + b.eiq, 0)
          : 0

        if (TypeActivitiesWithAchievements[TypeActivity]) {
          percent = achievements.length
            ? achievements.reduce((a, b) => a + b.percent, 0)
            : 0
        }
        if (TypeActivitiesWithOutAchievements[TypeActivity]) {
          const isSigned = signers.filter(({ signed }) => !signed)
          percent = !(isSigned.length > 0) && signers.length !== 0 ? 100 : 0
        }

        return {
          dateOrder: dateEnd ? dateEnd : _id.getTimestamp(),
          status: status[0].name.es,
          _id,
          name,
          eiq: Numbers.roundToTwo(eiq),
          percent,
          typeAgreement,
          unitType: nameUnitType?.es ?? null,
          tag: TypeActivity,
          dateStart: dateStart ?? null,
          dateEnd: dateEnd ?? null,
          lots: lots,
          lotsQuantity: lots.length,
          surface,
          volume: Numbers.roundToTwo(
            calculateCropVolumeUtils(keyUnitType, pay, surface)
          ),
          pay,
          dateObservation: dateObservation ?? null,
          signed: !achievements.length ? signers.length : null,
          signedIf: !achievements.length
            ? signers.filter(({ signed }) => signed).length
            : null,
          supplies,
          storages: storages ? getStorages(storages) : [],
          achievements: achievementsWithEiq
        }
      }
    )
    .filter((item) => item)

  return activitiesRes.sort((a, b) =>
    moment(a.dateOrder).diff(moment(b.dateOrder))
  )
}

const getStorages = (storages): Object[] => {
  return storages.map(
    ({
      tonsHarvest,
      label,
      storageType: {
        name: { es: storageTypeName }
      }
    }) => {
      return {
        tonsHarvest,
        storageTypeName,
        label
      }
    }
  )
}
