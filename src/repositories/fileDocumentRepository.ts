import models from '../models'
import { FileDocumentProps } from '../interfaces/FileDocument'

const { FileDocument } = models

class FileDocumentRepository {
  /**
   *
   * @param data
   *
   * @returns
   */
  public static create(data: FileDocumentProps) {
    return FileDocument.create(data)
  }
}
export default FileDocumentRepository
