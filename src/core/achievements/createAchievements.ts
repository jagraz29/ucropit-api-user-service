import {
  IEiqRangesDocument,
  IEntity,
  IEnvImpactIndex,
  IEnvImpactIndexDocument,
  TEntryEnvImpactIndex
} from '../../interfaces'
import {
  AchievementRepository,
  ActivityRepository,
  CropRepository,
  EiqRangesRepository,
  envImpactIndexRepository,
  LotRepository
} from '../../repositories'
import {
  getActivitiesOrderedByDateUtils,
  getEiqFromActivityWithEiq,
  getEiqOfAchievementsByLot,
  getEiqRange
} from '../../utils'

/**
 * set Eiq.
 *
 * @param string cropId
 * @param string activityId
 * @param object achievement
 *
 */
export const setEiqInEnvImpactIndex = async (
  { crop: cropId, activity: activityId, lots },
  { _id: achievementId }
): Promise<IEnvImpactIndexDocument[]> => {
  const entryEnvImpactIndex: Readonly<TEntryEnvImpactIndex> = {
    crop: cropId,
    activity: activityId,
    achievement: achievementId
  }
  const eiqRanges: IEiqRangesDocument[] = await EiqRangesRepository.getAllEiq()
  const crop = await CropRepository.getCropWithActivities(cropId)

  const activities = getActivitiesOrderedByDateUtils(crop)

  const envImpactIndexArray: IEnvImpactIndex[] = lots
    .map((id): IEnvImpactIndex => {
      const { eiq } = getEiqOfAchievementsByLot(id, activities) || {}
      if (eiq) {
        return null
      }
      return {
        ...entryEnvImpactIndex,
        lot: id,
        entity: IEntity.LOT,
        eiq: {
          value: eiq,
          range: getEiqRange(eiq, eiqRanges)
        }
      }
    })
    .filter((envImpactIndex) => envImpactIndex)
  const cropEiq: number = getEiqFromActivityWithEiq(activities)
  envImpactIndexArray.push({
    ...entryEnvImpactIndex,
    entity: IEntity.CROP,
    eiq: {
      value: cropEiq,
      range: getEiqRange(cropEiq, eiqRanges)
    }
  })
  const {
    eiq: activityEiq,
    achievements,
    envImpactIndex
  } = activities.find(({ _id }) => _id.toString() === activityId.toString())
  envImpactIndexArray.push({
    ...entryEnvImpactIndex,
    entity: IEntity.ACTIVITY,
    eiq: {
      value: activityEiq,
      planned: envImpactIndex?.eiq.planned ?? 0,
      range: getEiqRange(activityEiq, eiqRanges)
    }
  })
  const { eiq: achievementEiq } = achievements.find(
    ({ _id }) => _id.toString() === achievementId.toString()
  )
  envImpactIndexArray.push({
    ...entryEnvImpactIndex,
    entity: IEntity.ACHIEVEMENT,
    eiq: {
      value: achievementEiq,
      range: getEiqRange(achievementEiq, eiqRanges)
    }
  })
  return envImpactIndexRepository.createAllEnvImpactIndex(envImpactIndexArray)
}

export const setEnvImpactIndexInEntities = async (
  envImpactIndexIds: IEnvImpactIndexDocument[]
): Promise<void> => {
  const envImpactIndex: IEnvImpactIndexDocument[] =
    await envImpactIndexRepository.getEnvImpactIndexByIds(envImpactIndexIds)
  await Promise.all(
    envImpactIndex.map(
      async ({ entity, _id, crop, lot, activity, achievement }) => {
        if (entity === IEntity.CROP) {
          await CropRepository.updateOneCrop(
            { _id: crop },
            { envImpactIndex: _id }
          )
        }
        if (entity === IEntity.LOT) {
          await LotRepository.updateOneLot(
            { _id: lot },
            { envImpactIndex: _id }
          )
        }
        if (entity === IEntity.ACTIVITY) {
          await ActivityRepository.updateOneActivity(
            { _id: activity },
            { envImpactIndex: _id }
          )
        }
        if (entity === IEntity.ACHIEVEMENT) {
          await AchievementRepository.updateOneAchievement(
            { _id: achievement },
            { envImpactIndex: _id }
          )
        }
      }
    )
  )
}
