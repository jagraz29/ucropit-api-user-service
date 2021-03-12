import fs from 'fs'
import PDF from '../utils/PDF'
import Stamp from '../utils/Stamp'

import { basePath, makeDirIfNotExists } from '../utils/Files'

class BlockChainServices {
  /**
   * Create PDF and Register Sign in BlockChain with timestamp.
   *
   * @param crop
   * @param activity
   * @param user
   */
  public static async sign(crop, activity): Promise<any> {
    await makeDirIfNotExists(
      `${basePath()}${process.env.DIR_PDF_SINGS}/${activity.key}`
    )

    const nameFile = `${activity.key}-${activity.type.name.es}-sing.pdf`
    const pathToSave = `${basePath()}${process.env.DIR_PDF_SINGS}/${
      activity.key
    }`

    const { hash, path } = await PDF.generate({
      pathFile: `${pathToSave}/${nameFile}`,
      files: activity.files,
      crop: crop,
      activity: activity
    })

    const { ots, fileOts } = await Stamp.stampHash(hash)

    const otsObject = await this.saveOtsFile(
      fileOts,
      `${nameFile}.ots`,
      pathToSave
    )

    return Promise.resolve({
      ots,
      hash,
      pathPdf: path,
      nameFilePdf: nameFile,
      ...otsObject
    })
  }

  public static async saveOtsFile(
    fileOtsBytes: any,
    nameFile,
    path: string
  ): Promise<any> {
    const pathToSaveFile = `${path}/${nameFile}`

    fs.writeFileSync(pathToSaveFile, fileOtsBytes)

    return Promise.resolve({
      nameFileOts: nameFile,
      pathOtsFile: `${pathToSaveFile}`
    })
  }
}

export default BlockChainServices
