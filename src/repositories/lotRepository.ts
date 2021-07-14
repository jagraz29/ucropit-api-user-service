import models from '../models'

const { Lot } = models

export class LotRepository {
  /**
   *
   * @param string lotId
   *
   * @returns
   */
  public static findById(lotId: string) {
    return Lot.findById(lotId)
  }
  /**
   *
   * @param query
   * @param dataToUpdate
   *
   * @returns
   */
  public static async updateOneLot(
    query: any,
    dataToUpdate: any
  ): Promise<any> {
    return Lot.updateOne(query, dataToUpdate)
  }
}
