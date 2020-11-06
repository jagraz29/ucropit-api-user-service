import models from '../models'
import user from '../models/user'
const FileDocument = models.FileDocument
const ApprovalRegisterSign = models.ApprovalRegisterSign

interface ApprovalRegister {
  ots: String
  hash: String
  path: String
  nameFile: String
  user: String | any
  file?: String | any
}

interface FileDocument {
  nameFile: String
  path: String
  user: String | any
  date: Date
}

class ApprovalRegisterSignService {
  /**
   *
   * @param data
   */
  public static async create (data: ApprovalRegister) {
    const fileDocument = await this.createFile({
      nameFile: data.nameFile,
      path: data.path,
      user: data.user._id,
      date: new Date()
    })

    return ApprovalRegisterSign.create({
      ots: data.ots,
      hash: data.hash,
      path: data.path,
      nameFile: data.nameFile,
      user: user._id,
      file: fileDocument._id
    })
  }

  /**
   *
   * @param dataFile
   */
  private static async createFile (dataFile: FileDocument) {
    return FileDocument.create(dataFile)
  }
}

export default ApprovalRegisterSignService
