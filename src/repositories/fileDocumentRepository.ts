import models from '../models'
import { FileDocumentProps } from '../interfaces/FileDocument'

const { FileDocument, SatelliteFile } = models

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

  /**
   *
   * @param data
   * @returns
   */
  public static createSatelliteImage(data) {
    return SatelliteFile.create(data)
  }
}
export default FileDocumentRepository
