import moment from 'moment'
import {
  calculateCropVolumeUtils,
  Numbers,
  getEvidencePdf,
  getEvidenceImage,
  getSignerList,
  getAchievements,
  getSuppliesAndTotalTypes
} from '../'
import {
  TypeActivitiesWithAchievements,
  TypeActivitiesWithOutAchievements,
  IAchievement,
  TypeActivities
} from '../../interfaces'

export const getActivitiesOrderedByDateUtils = ({ activities, members }) => {
  const activitiesRes = activities
    .map(
      ({
        _id,
        achievements: achievementsParams,
        type: { tag: TypeActivity },
        envImpactIndice,
        signers,
        name,
        lots,
        surface,
        storages,
        files,
        dateStart,
        dateEnd,
        typeAgreement,
        supplies,
        pay: payEntry,
        dateObservation,
        status,
        unitType
      }) => {
        let percent = 0
        let eiq = 0
        let achievements: IAchievement[] = []
        const pay = payEntry ?? 0
        const { key: keyUnitType, name: nameUnitType } = unitType || {}

        if (TypeActivity === TypeActivities.ACT_AGREEMENTS) {
          return null
        }
        achievements = getAchievements(achievementsParams, members)
        eiq = achievements.length
          ? achievements.reduce((a, b) => a + b.eiq, 0)
          : 0

        if (TypeActivitiesWithAchievements[TypeActivity]) {
          percent = achievementsParams.length
            ? achievementsParams.reduce((a, b) => a + b.percent, 0)
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
          envImpactIndice,
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
          signers: getSignerList(signers, members),
          supplies: getSuppliesAndTotalTypes(supplies),
          suppliesList: supplies,
          storages: storages ? getStorages(storages) : [],
          achievements: achievements,
          evidencesPdf: getEvidencePdf(files),
          evidenceImages: getEvidenceImage(files)
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
