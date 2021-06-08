import ServiceBase from './common/ServiceBase'
import { AchievementModel } from '../models'
import PDF from '../utils/pdf/PDF'
import mongoose from 'mongoose'
import { basePath, fileExist, makeDirIfNotExists } from '../utils'
import { Signer } from '../interfaces'

interface IAchievement {
  _id?: String
  dateAchievement?: String
  surface?: number
  lots?: Array<string>
  supplies?: Array<any>
  evidences?: Array<any>
  signers?: Array<any>
  percent?: Number
}

class AchievementService extends ServiceBase {
  public static async find(query): Promise<any> {
    return AchievementModel.find(query)
      .populate('lots')
      .populate('files')
      .populate('signers')
  }

  /**
   *
   * @param string id
   */
  public static async findById(id: string): Promise<any> {
    return AchievementModel.findById(id)
      .populate('lots')
      .populate('files')
      .populate('signers')
      .populate('destination')
      .populate('supplies.typeId')
  }

  /**
   *
   * @param IAchievement achievement
   * @param activity
   */
  public static async store(achievement, activity) {
    achievement.percent = this.calcPercent(achievement.surface, activity)
    await this.addLotsAchievement(achievement.lots, activity)

    if (!achievement._id) {
      achievement._id = mongoose.Types.ObjectId()
    }

    return AchievementModel.create(achievement)
  }

  /**
   *
   * @param Array lots
   * @param activity
   */

  public static calcPercent(surface: number, activity) {
    return Math.round((surface * 100) / activity.surface)
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

    const resultPDF = await PDF.generatePdfSign({
      pathFile: `${pathPdf}/${nameFile}`,
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
   * Add services integration.
   *
   * @param id
   * @param service
   */
  public static async changeStatusSynchronized(
    id: string,
    service: string
  ): Promise<void> {
    await AchievementModel.findByIdAndUpdate(id, {
      synchronizedList: [{ service, isSynchronized: true }]
    })
  }

  public static async updateSigners(signers: Signer[], achievementId: string) {
    return AchievementModel.updateOne(
      { _id: achievementId },
      { $set: { signers: signers } }
    )
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
