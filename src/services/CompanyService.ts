import FileUpload from './FileUpload'
import models from '../models'

const Company = models.Company
const FileDocument = models.FileDocument

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

  public static async store (company: ICompany, files, user) {
    let companies = await this.search({
      identifier: company.identifier
    })

    if (!companies[0]) {
      return Company.create(company)
    }

    return this.addFiles(files, companies[0], user)
  }

  private static async addFiles (files, company, user) {
    const store = new FileUpload(
      files,
      `${process.env.DIR_UPLOADS}/${process.env.DIR_FILES_COMPANY}/${company.identifier}`
    )

    const filesUploaded = await store.save()

    const documents = filesUploaded.map(async (item) => {
      const file = await FileDocument.create({
        ...item,
        date: new Date(),
        user: user._id
      })

      return file._id
    })

    company.files = await Promise.all(documents)

    return company.save()
  }
}

export default CompanyService
