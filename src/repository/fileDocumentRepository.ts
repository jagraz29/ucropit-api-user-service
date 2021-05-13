import models from '../models'
const { FileDocument } = models

interface FileDocument {
  nameFile: String
  path: String
  user?: String | any
  cropId?: String | any
  date: Date
}

export class FileDocumentRepository {
  /**
   *  Set history file.
   *
   * @param dataFile
   */
  public static async createFile (dataFile: FileDocument): Promise<Object[] | null> {
    const fileDocumentInstance = await FileDocument.create(dataFile)
    return fileDocumentInstance
      ? fileDocumentInstance
      : null
  }

  /**
   *  Set history file.
   *
   * @param dataFile
   */
  public static async getFiles (cropId): Promise<Object[] | null> {
    const fileDocumentInstance = await FileDocument.find({ cropId })
    return !!fileDocumentInstance.length
      ? fileDocumentInstance
      : null
  }
}
