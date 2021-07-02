import models from '../models'
const FileDocument = models.FileDocument
const ApprovalRegisterSign = models.ApprovalRegisterSign

interface ApprovalRegister {
  ots: string
  hash: string
  pathPdf: string
  nameFilePdf: string
  nameFileOts: string
  pathOtsFile: string
  activity: string | any
  file?: string | any
}

interface FileDocument {
  nameFile: string
  path: string
  user?: string | any
  date: Date
}

class ApprovalRegisterSignService {
  /**
   *
   * @param data
   */
  public static async create(data: ApprovalRegister) {
    const fileDocumentPdf = await this.createFile({
      nameFile: data.nameFilePdf,
      path: data.pathPdf,
      date: new Date()
    })

    const fileDocumentOts = await this.createFile({
      nameFile: data.nameFileOts,
      path: data.pathOtsFile,
      date: new Date()
    })

    return ApprovalRegisterSign.create({
      ots: data.ots,
      hash: data.hash,
      activity: data.activity._id,
      filePdf: fileDocumentPdf._id,
      fileOts: fileDocumentOts._id
    })
  }

  /**
   *
   * @param dataFile
   */
  private static async createFile(dataFile: FileDocument) {
    return FileDocument.create(dataFile)
  }
}

export default ApprovalRegisterSignService
