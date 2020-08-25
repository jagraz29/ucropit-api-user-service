import models from '../models'

const Company = models.Company

interface ICompany {
  identifier: string
  typePerson: string
  name: string
  address: string
  addressFloor: string
}

class CompanyService {
  /**
   * Search Companies by query filter.
   *
   * @param query
   */
  public static async search (query) {
    return Company.find(query)
  }

  public static async store (company: ICompany) {
    let companyObject = (
      await this.search({
        identifier: company.identifier
      })
    )[0]

    if (!companyObject) {
      return Company.create(company)
    }

    return companyObject
  }
}

export default CompanyService
