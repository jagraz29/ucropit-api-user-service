import { EiqRangesModel } from '../models'
import { IEiqRangesDocument, IEiqRanges } from '../interfaces'

export class EiqRangesRepository {
  public static async getAllEiq (): Promise<IEiqRangesDocument[]> {
    return EiqRangesModel.find()
  }

  /**
   *
   * @param eiq
   *
   * @returns
   */
  public static async createOneEiq (eiq: IEiqRanges): Promise<IEiqRangesDocument> {
    return EiqRangesModel.create(eiq)
  }

  /**
   *
   * @param eiqs
   *
   * @returns
   */
  public static async createAllEiq (eiqs: IEiqRanges[]): Promise<IEiqRangesDocument[]> {
    return EiqRangesModel.insertMany(eiqs)
  }

  /**
   *
   * @param id
   * @param dataToUpdate
   *
   * @returns
   */
  public static async updateOneByIdEiq (id: String, dataToUpdate: Partial<IEiqRanges>): Promise<IEiqRangesDocument | any > {
    return EiqRangesModel.updateOne(id, dataToUpdate)
  }
}
