import models from '../models'

const { Activity } = models

class ActivityRepository {
  /**
   *
   * @param string lotId
   *
   * @returns
   */
  public static findById(lotId: string) {
    return Activity.findById(lotId)
  }
}
export default ActivityRepository
