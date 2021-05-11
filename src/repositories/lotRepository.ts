import models from '../models'

const { Lot } = models

class LotRepository {
  /**
   *
   * @param string lotId
   *
   * @returns
   */
  public static findById(lotId: string) {
    return Lot.findById(lotId)
  }
}
export default LotRepository
