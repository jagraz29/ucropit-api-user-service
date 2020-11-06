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
  public static async sign (
    crop,
    activity,
    user
  ): Promise<{ ots: string; hash: string; path: string; nameFile: string }> {
    await makeDirIfNotExists(
      `${basePath()}${process.env.DIR_PDF_SINGS}/${activity.key}`
    )

    const nameFile = `${activity.key}-${activity.type.name.es}-${user._id}-sing.pdf`

    const { hash, path } = await PDF.generate({
      pathFile: `${basePath()}${process.env.DIR_PDF_SINGS}/${
        activity.key
      }/${nameFile}`,
      data: await PDF.generateTemplateActivity(activity, crop, user),
      files: activity.files
    })

    const ots = await Stamp.stampHash(hash)

    return Promise.resolve({ ots, hash, path, nameFile })
  }
}

export default BlockChainServices
