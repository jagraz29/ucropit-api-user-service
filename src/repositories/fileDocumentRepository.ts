import models from '../models'
import { FileDocumentProps } from '../interfaces/FileDocument'
const { FileDocument } = models

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
