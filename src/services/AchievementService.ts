import ServiceBase from './common/ServiceBase'
import models from '../models'
import PDF from '../utils/PDF'

import { basePath, fileExist, makeDirIfNotExists } from '../utils/Files'

const Achievement = models.Achievement

interface IAchievement {
  dateAchievement?: String
  surface?: number
  lots?: Array<string>
  supplies?: Array<any>
  evidences?: Array<any>
  signers?: Array<any>
  percent?: Number
}

class AchievementService extends ServiceBase {
  public static async find(query) {
    return Achievement.find(query)
      .populate('lots')
      .populate('files')
      .populate('signers')
  }

  /**
   *
   * @param string id
   */
  public static async findById(id: string) {
    return Achievement.findById(id)
      .populate('lots')
      .populate('files')
      .populate('signers')
      .populate('destination')
  }

  /**
   *
   * @param IAchievement achievement
   * @param activity
   */
  public static async store(achievement: IAchievement, activity) {
    achievement.percent = this.calcPercent(achievement.surface, activity)
    await this.addLotsAchievement(achievement.lots, activity)

    return Achievement.create(achievement)
  }

  /**
   *
   * @param Array lots
   * @param activity
   */
  public static calcPercent(surface: number, activity) {
    const totalSurface = activity.lots.reduce(
      (a, b) => a + (b['surface'] || 0),
      0
    )

    return Math.round((surface * 100) / totalSurface)
  }

  public static async generatePdf(activity, crop) {
    const pathPdf = this.getPathFilePdf(activity)
    const nameFile = `${activity.key}-${activity.type.name.es}-sing.pdf`
    const direction = `${process.env.BASE_URL}/${process.env.DIR_UPLOADS}/${process.env.DIR_FOLDER_PDF_SIGNS}/${activity.key}/${nameFile}`

    if (activity.approvalRegister) {
      const publicPath = direction

      return { publicPath }
    }

    await makeDirIfNotExists(pathPdf)

    const resultPDF = await PDF.generate({
      pathFile: `${pathPdf}/${nameFile}`,
      files: activity.files,
      crop: crop,
      activity: activity
    })

    return {
      resultPDF,
      publicPath: direction
    }
  }

  public static getPathFilePdf(activity) {
    return `${basePath()}${process.env.DIR_PDF_SINGS}/${activity.key}`
  }

  /**
   *
   * @param Array lots
   * @param activity
   */
  private static addLotsAchievement(lots: Array<string>, activity) {
    if (activity.lotsMade.length === 0) {
      activity.lotsMade = lots
    } else {
      activity.lotsMade = activity.lotsMade.concat(lots)
    }

    return activity.save()
  }
}

export default AchievementService
