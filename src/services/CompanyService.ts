import UploadService from './UploadService'
import models from '../models'
import { fileExist, removeFile } from '../utils/Files'
import remove from 'lodash/remove'

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
    const filesUploaded = await UploadService.upload(
      files,
      `${process.env.DIR_FILES_COMPANY}/${company.identifier}`
    )

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

  public static async removeFiles (fileId: string, company, filePath: string) {
    if (fileExist(filePath)) {
      removeFile(filePath)

      const fileRemove = await FileDocument.findByIdAndDelete(fileId)

      if (fileRemove) {
        const files = remove(company.files, function (item) {
          return item === fileId
        })

        company.files = files

        await company.save()
      }
      return true
    }

    return false
  }
}

export default CompanyService
