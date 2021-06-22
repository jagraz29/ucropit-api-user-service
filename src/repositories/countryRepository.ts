import models from '../models'

const { Country } = models

export class CountryRepository {
  /**
   *
   * @param query
   * @param limit
   * @param skip
   * @param sort
   * @param populate
   *
   * @returns
   */
  public static async getCountries({
    query,
    limit,
    skip,
    sort,
    populate,
  }: any): Promise<any> {
    return Country.find(query ?? {})
      .populate(populate ?? [])
      .limit(limit ?? 0)
      .skip(skip ?? 0)
      .sort(sort ?? {})
  }

  /**
   *
   * @param query
   * @param populate
   *
   * @returns
   */
  public static async getCountry({ query, populate }: any): Promise<any> {
    return Country.findOne(query ?? {}).populate(populate ?? [])
  }

  /**
   *
   * @param dataToCreate
   *
   * @returns
   */
  public static async createCountry(dataToCreate: any): Promise<any> {
    return Country.create(dataToCreate)
  }
}
