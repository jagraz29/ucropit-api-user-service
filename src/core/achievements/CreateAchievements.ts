import { IEiqRangesDocument, IEntity, IEnvImpactIndice, IEnvImpactIndiceDocument } from "../../interfaces"
import { AchievementRepository, ActivityRepository, CropRepository, EiqRangesRepository, envImpactIndiceRepository, LotRepository } from "../../repositories"
import { getActivitiesOrderedByDateUtils, getEiqFromActivityWithEiq, getEiqOfAchievementsByLot, getEiqRange } from "../../utils"


  /**
   * set Eiq.
   *
   * @param string cropId
   * @param string activityId
   * @param object achievement
   *
   */
export const setEiqInEnvImpactIndice = async ({crop:cropId,activity: activityId,lots},{ _id: achievementId }): Promise<IEnvImpactIndiceDocument[]> => {
    let entryEnvImpactIndice = {
        crop: cropId,
        activity: activityId,
        achievement:achievementId
      }
        const eiqRanges: IEiqRangesDocument[] = await EiqRangesRepository.getAllEiq()
        const crop = await CropRepository.getCropWithActivities(cropId)
        const activities = getActivitiesOrderedByDateUtils(crop)

        let envImpactIndices: IEnvImpactIndice[] = lots.map((id): IEnvImpactIndice =>{
          const { eiq } = getEiqOfAchievementsByLot(id,activities)
          return {
            ...entryEnvImpactIndice,
            lot:id,
            entity: IEntity.LOT,
            eiq:{
              value: eiq,
              range: getEiqRange(eiq, eiqRanges)
            }
          }
        })
        const cropEiq: number = getEiqFromActivityWithEiq(activities)
        envImpactIndices.push({
          ...entryEnvImpactIndice,
          entity: IEntity.CROP,
          eiq:{
            value: cropEiq,
            range: getEiqRange(cropEiq, eiqRanges)
          }
        })
        const {eiq: activityEiq, achievements} = activities.find(({_id}) =>_id.toString() === activityId.toString())
        envImpactIndices.push({
          ...entryEnvImpactIndice,
          entity: IEntity.ACTIVITY,
          eiq:{
            value: activityEiq,
            range: getEiqRange(activityEiq, eiqRanges)
          }
        })
        const { eiq: achievementEiq } = achievements.find(({_id}) =>_id.toString() === achievementId.toString())
        envImpactIndices.push({
          ...entryEnvImpactIndice,
          entity: IEntity.ACHIEVEMENT,
          eiq:{
            value: achievementEiq,
            range: getEiqRange(achievementEiq, eiqRanges)
          }
        })
        return envImpactIndiceRepository.createAllEnvImpactIndice(envImpactIndices)
}

export const setEnvImpactIndicesInEntities = async (envImpactIndiceIds): Promise<void> => {
    const envImpactIndices: IEnvImpactIndiceDocument[] = await envImpactIndiceRepository.getEnvImpactIndicesByIds(envImpactIndiceIds)
    Promise.all(envImpactIndices.map(async ({entity, _id, crop, lot, activity, achievement }) =>{
      if (entity === IEntity.CROP) {
        await CropRepository.updateOneCrop({_id: crop},{envImpactIndice:_id})
      }
      if (entity === IEntity.LOT) {
        await LotRepository.updateOneLot({_id: lot},{envImpactIndice:_id})
      }
      if (entity === IEntity.ACTIVITY) {
        await ActivityRepository.updateOneActivity({_id: activity},{envImpactIndice:_id})
      }
      if (entity === IEntity.ACHIEVEMENT) {
        await AchievementRepository.updateOneAchievement({_id: achievement},{envImpactIndice:_id})
      }
    }))
}