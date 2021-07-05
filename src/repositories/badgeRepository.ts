import models from '../models'

const { Badge } = models

export class BadgeRepository {
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
  public static async getBadges({
    query,
    limit,
    skip,
    sort,
    populate
  }: any): Promise<any> {
    return Badge.find(query ?? {})
      .populate(populate ?? [])
      .limit(limit ?? 0)
      .skip(skip ?? 0)
      .sort(sort ?? {})
  }

  /**
   *
   * @param dataToCreate
   *
   * @returns
   */
  public static async createBadge(dataToCreate: any): Promise<any> {
    return Badge.create(dataToCreate)
  }

  /**
   *
   * @param query
   * @param dataToUpdate
   *
   * @returns
   */
  public static async updateOneBadge(
    query: any,
    dataToUpdate: any
  ): Promise<any> {
    return Badge.updateOne(query, dataToUpdate)
  }

  /**
   *
   * @param query
   *
   * @returns
   */
  public static async deleteOneBadge(query: any): Promise<any> {
    return Badge.deleteOne(query)
  }
}
