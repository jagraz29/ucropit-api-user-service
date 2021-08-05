import models from '../models'
import { TypeAgreementDocument } from '../models/typeAgreement'
const { TypeAgreement } = models

export class TypeAgreementRepository {
  /**
   * Get all TypeAgreement
   * @returns
   */
  public static async getAll(): Promise<TypeAgreementDocument[]> {
    return TypeAgreement.find({}).lean()
  }
  /**
   *
   * @param query
   * @param limit
   * @param skip
   * @param sort
   * @param dataToPopulate
   *
   * @returns
   */
  public static async getTypeAgreements({
    query,
    limit,
    skip,
    sort,
    populate
  }: any): Promise<any> {
    return TypeAgreement.find(query ? query : {})
      .populate(populate ? populate : [])
      .limit(limit ? limit : 0)
      .skip(skip ? skip : 0)
      .sort(sort ? sort : {})
  }

  /**
   *
   * @param dataToCreate
   *
   * @returns
   */
  public static async createTypeAgreement(dataToCreate: any): Promise<any> {
    return TypeAgreement.create(dataToCreate)
  }

  /**
   *
   * @param query
   * @param dataToUpdate
   *
   * @returns
   */
  public static async updateOneTypeAgreement(
    query: any,
    dataToUpdate: any
  ): Promise<any> {
    return TypeAgreement.updateOne(query, dataToUpdate)
  }

  /**
   *
   * @param query
   *
   * @returns
   */
  public static async deleteOneTypeAgreement(query: any): Promise<any> {
    return TypeAgreement.deleteOne(query)
  }
}
