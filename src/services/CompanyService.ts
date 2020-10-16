import { FileArray } from 'express-fileupload'
import ServiceBase from './common/ServiceBase'
import models from '../models'

const Company = models.Company

interface ICompany {
  identifier: string
  typePerson: string
  name: string
  address: string
  addressFloor: string
}

class CompanyService extends ServiceBase {
  /**
   * Search Companies by query filter.
   *
   * @param query
   */
  public static async search (query) {
    return Company.find(query)
  }

  /**
   * Search one company by Id.
   *
   * @param string id
   */
  public static async findById (id: string) {
    return Company.findById(id).populate('files')
  }

  /**
   * Search or create a new company
   *
   * @param ICompany company
   * @param files
   * @param user
   */
  public static async store (company: ICompany, files: FileArray, evidences, user) {
    let companies = await this.search({
      identifier: company.identifier
    })

    if (companies[0]) {
      return companies[0]
    }

    if (!files) {
      return Company.create(company)
    }

    const companyCreated = await Company.create(company)

    if (companyCreated) {
      user.companies.push({
        company: companyCreated._id
      })

      await user.save()
    }

    return this.addFiles(companyCreated, evidences, files, user, `companies/${companyCreated.identifier}`)
  }

}

export default CompanyService
