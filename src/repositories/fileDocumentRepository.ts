import models from '../models'
import { FileDocumentProps } from '../interfaces/FileDocument'
const { FileDocument } = models

interface FileDocument {
  nameFile: String
  path: String
  user?: String | any
  date: Date
}

export class FileDocumentRepository {
  /**
   *  Set history file.
   *
   * @param dataFile
   */
  public static async createFile(dataFile: FileDocumentProps) {
    const fileDocumentInstance = await FileDocument.create(dataFile)
    return fileDocumentInstance ? fileDocumentInstance : null
  }
}
