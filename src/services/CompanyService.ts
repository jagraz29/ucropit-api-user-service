import { FileArray } from 'express-fileupload'
import ServiceBase from './common/ServiceBase'
import models from '../models'

const Company = models.Company

interface ICompany {
  identifier?: string
  typePerson?: string
  name?: string
  address?: string
  addressFloor?: string
}

class CompanyService extends ServiceBase {
  /**
   * Search Companies by query filter.
   *
   * @param query
   */
  public static async search(query) {
    return Company.find(query)
  }

  /**
   * Search one company by Id.
   *
   * @param string id
   */
  public static async findById(id: string) {
    return Company.findById(id).populate('files')
  }

  /**
   * Search or create a new company
   *
   * @param ICompany company
   * @param files
   * @param user
   */
  public static async store(
    company: ICompany,
    files: FileArray,
    evidences,
    user
  ) {
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
      const exists = await user.companies.findIndex(
        (el) => el.identifier === companyCreated.identifier
      )

      if (exists > -1) {
        await user.companies.set(exists, {
          ...user.companies[exists],
          company: companyCreated.id
        })
      } else {
        user.companies.push({
          company: companyCreated._id
        })
      }

      user = await user.save()
    }

    return this.addFiles(
      companyCreated,
      evidences,
      files,
      user,
      `companies/${companyCreated.identifier}`
    )
  }

  public static async updated(company: ICompany, id: string) {
    await Company.findByIdAndUpdate(id, company)
    return Company.findById(id)
  }

  public static async addServiceIntegration(service: string, id: string) {
    const company = await Company.findById(id)
    const isServiceIntegration = company.servicesIntegrations.find(
      (item) => item.service === service
    )

    if (!isServiceIntegration) {
      company.servicesIntegrations.push({
        service: service
      })

      return company.save()
    }

    return { error: true }
  }
}

export default CompanyService
