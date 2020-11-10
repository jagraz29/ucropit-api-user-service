import models from '../models'
import user from '../models/user'
const FileDocument = models.FileDocument
const ApprovalRegisterSign = models.ApprovalRegisterSign

interface ApprovalRegister {
  ots: String
  hash: String
  pathPdf: String
  nameFilePdf: String
  nameFileOts: String
  pathOtsFile: String
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
    const fileDocumentPdf = await this.createFile({
      nameFile: data.nameFilePdf,
      path: data.pathPdf,
      user: data.user._id,
      date: new Date()
    })

    const fileDocumentOts = await this.createFile({
      nameFile: data.nameFileOts,
      path: data.pathOtsFile,
      user: data.user._id,
      date: new Date()
    })

    return ApprovalRegisterSign.create({
      ots: data.ots,
      hash: data.hash,
      user: data.user._id,
      filePdf: fileDocumentPdf._id,
      fileOts: fileDocumentOts._id
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
