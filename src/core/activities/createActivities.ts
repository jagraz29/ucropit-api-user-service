import {
  IEntity,
  IEnvImpactIndexOfActivity,
  IEnvImpactIndexDocument
} from '../../interfaces'
import {
  ActivityRepository,
  envImpactIndexRepository
} from '../../repositories'
import { calculateEIQSurfaceAchievement } from '../../utils'

/**
 * set Eiq.
 *
 * @param Object DataParam
 *
 */
export const setEiqInEnvImpactIndexActivity = async (
  DataParam
): Promise<IEnvImpactIndexDocument> => {
  const {
    crop: cropId,
    activity: { _id }
  } = DataParam
  const eiq = calculateEIQSurfaceAchievement(DataParam)
  const envImpactIndex: IEnvImpactIndexOfActivity = {
    crop: cropId,
    activity: _id,
    entity: IEntity.ACTIVITY,
    eiq: {
      planned: eiq
    }
  }

  return envImpactIndexRepository.createEnvImpactIndex(envImpactIndex)
}

export const setEnvImpactIndexInActivity = async ({
  _id,
  activity
}: IEnvImpactIndexDocument): Promise<void> => {
  const { _id: envImpactIndex }: IEnvImpactIndexDocument =
    await envImpactIndexRepository.getEnvImpactIndexById(_id)
  await ActivityRepository.updateOneActivity(
    { _id: activity },
    { envImpactIndex }
  )
}
