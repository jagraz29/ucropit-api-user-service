import models from '../models'
import achievement from '../models/achievement'
import { isNowGreaterThan } from '../utils/Date'
import ServiceBase from './common/ServiceBase'
import ActivityService from './ActivityService'
const Crop = models.Crop
const Activity = models.Activity

interface ICrop {
  name: string
  pay: Number
  surface: Number
  dateCrop: string
  dateHarvest: string
  cropType: Object
  unitType: Object
  lots: Array<any>
  members: Array<any>
  company: string
}

const statusActivities: Array<any> = [
  {
    name: 'TO_COMPLETE',
    cropStatus: 'pending'
  },
  {
    name: 'PLANNED',
    cropStatus: 'toMake'
  },
  {
    name: 'DONE',
    cropStatus: 'done'
  },
  {
    name: 'FINISHED',
    cropStatus: 'finished'
  },
  {
    name: 'EXPIRED',
    cropStatus: 'toMake'
  }
]

class CropService extends ServiceBase {
  /**
   * Get all crops.
   *
   * @param query
   */
  public static async getAll (query) {
    let crops = await this.findAll(query)

    // crops = crops.map(async (crop) => {
    //   crop = await this.expiredActivities(crop)

    //   crop = await this.changeStatusActivitiesRange(crop)

    //   return crop
    // })

    return crops
  }

  /**
   * Find All crops by query filter.
   *
   * @param query
   */
  public static async findAll (query) {
    return Crop.find(query)
      .populate('lots.data')
      .populate('cropType')
      .populate('unitType')
      .populate('company')
      .populate({
        path: 'pending',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' }
        ]
      })
      .populate({
        path: 'toMake',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' }
        ]
      })
      .populate({
        path: 'done',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' }
        ]
      })
      .populate('members.user')
      .populate({
        path: 'finished',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' }
        ]
      })
  }
  /**
   *
   * @param cropId
   */
  public static async getCropById (cropId: string) {
    let crop = await this.findOneCrop(cropId)

    crop = await this.expiredActivities(crop)

    crop = await this.changeStatusActivitiesRange(crop)

    return crop
  }

  /**
   * Find One Crop by Id.
   *
   * @param cropId
   */
  public static async findOneCrop (cropId: string) {
    return Crop.findById(cropId)
      .populate('lots.data')
      .populate('cropType')
      .populate('unitType')
      .populate({ path: 'company', populate: [{ path: 'files' }] })
      .populate({
        path: 'pending',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' }
        ]
      })
      .populate({
        path: 'toMake',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' }
        ]
      })
      .populate({
        path: 'done',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' },
          {
            path: 'achievements',
            populate: [{ path: 'lots' }, { path: 'files' }]
          },
          { path: 'lotsMade' }
        ]
      })
      .populate({
        path: 'finished',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' },
          { path: 'files' }
        ]
      })
      .populate('members.user')
  }

  /**
   * Expired Activity.
   *
   * @param crop
   */
  public static async expiredActivities (crop: any) {
    let activitiesToMake = await this.checkListActivitiesExpired(
      crop,
      'toMake'
    )

    crop.toMake = await Promise.all(activitiesToMake)

    return crop
  }

  /**
   * Change status in list activities range.
   *
   * @param crop
   *
   * @return Promise
   */
  public static async changeStatusActivitiesRange (crop: any): Promise<void> {
    const listActivitiesExpired = (
      await this.listActivitiesExpiredRange(crop, 'done')
    ).filter((activity) => activity)
    const listActivitiesFinished = (
      await this.listActivitiesFinishedRange(crop, 'done')
    ).filter((activity) => activity)

    if (listActivitiesExpired.length > 0) {
      for (let activity of listActivitiesExpired) {
        await this.removeActivities(activity, crop, 'done')
        activity = await ActivityService.changeStatus(activity, 'TO_COMPLETE')
        await this.addActivities(activity, crop)
      }
    }
    if (listActivitiesFinished.length > 0) {
      for (let activity of listActivitiesFinished) {
        await this.removeActivities(activity, crop, 'done')
        activity = await ActivityService.changeStatus(activity, 'FINISHED')
        await this.addActivities(activity, crop)
      }
    }

    return this.findOneCrop(crop._id)
  }

  public static async handleDataCrop (
    data,
    company,
    lotsData,
    activities,
    { members }
  ) {
    const lotsArray = []
    let tagIndex = null

    for (const item of lotsData) {
      for (const lot of item.lots) {
        if (tagIndex !== item.tag) {
          lotsArray.push({
            tag: item.tag,
            data: [lot._id]
          })
          tagIndex = item.tag
        } else {
          const index = lotsArray.findIndex((x) => x.tag === item.tag)
          lotsArray[index].data.push(lot._id)
        }
      }
    }

    data.lots = lotsArray
    data.company = company ? company._id : null
    data.pending = activities

    let newCrop = await this.store(data)

    newCrop.members.push({
      user: members._id,
      producer: true,
      identifier: data.identifier
    })

    await newCrop.save()

    return newCrop
  }

  public static async store (crop: ICrop) {
    const newCrop = new Crop(crop)
    return newCrop.save()
  }

  public static async removeActivities (activity, crop, statusCrop = 'pending') {
    crop[statusCrop].pull(activity._id)

    return crop.save()
  }

  public static async addActivities (activity, crop) {
    const status = statusActivities.find(
      (item) => item.name === activity.status[0].name.en
    )

    const statusCrop = status.cropStatus
    crop[statusCrop].push(activity._id)
    return crop.save()
  }

  public static async cancelled (cropId) {
    const crop = await Crop.findById(cropId)

    if (
      crop.toMake.length === 0 &&
      crop.done.length === 0 &&
      crop.finished.length === 0
    ) {
      crop.cancelled = true

      await crop.save()

      return true
    }

    return false
  }

  /**
   *
   * @param crop
   * @param statusCrop
   */
  private static async listActivitiesExpiredRange (crop, statusCrop: string) {
    const activities = crop[statusCrop].map(async (activity: any) => {
      if (
        this.isExpiredActivity(activity, statusCrop) &&
        !this.isTotalPercentAchievements(activity)
      ) {
        return activity
      }

      return undefined
    })

    return Promise.all(activities)
  }

  /**
   *
   * @param crop
   * @param statusCrop
   */
  private static async listActivitiesFinishedRange (crop, statusCrop: string) {
    const activities = crop[statusCrop].map(async (activity: any) => {
      if (
        !this.isExpiredActivity(activity, statusCrop) &&
        this.isTotalPercentAchievements(activity) &&
        this.checkCompleteSignedEachAchievements(activity)
      ) {
        return activity
      }

      return undefined
    })

    return Promise.all(activities)
  }

  /**
   *
   * @param activity
   */
  private static checkCompleteSignedEachAchievements (activity: any): boolean {
    let completeSigned = true
    for (const achievement of activity.achievements) {
      if (!this.isCompleteSignsUsers(achievement)) {
        completeSigned = false
        return completeSigned
      }
    }

    return completeSigned
  }

  /**
   *
   * @param crop
   * @param statusCrop
   */
  private static async checkListActivitiesExpired (crop, statusCrop: string) {
    return crop[statusCrop].map(async (activity: any) => {
      if (this.isExpiredActivity(activity)) {
        activity.status[0].name.en = 'EXPIRED'
        activity.status[0].name.es = 'VENCIDA'

        await this.expiredActivity(activity)

        return activity
      }

      return activity
    })
  }

  /**
   *
   * @param activity
   */
  private static isExpiredActivity (activity, status?): boolean {
    if (
      (activity.dateLimitValidation &&
        isNowGreaterThan(activity.dateLimitValidation) &&
        !status) ||
      (activity.dateEnd && isNowGreaterThan(activity.dateEnd && status))
    ) {
      return true
    }

    return false
  }

  /**
   *  Check is make total percent in achievements activities.
   *
   * @param activity
   *
   * @return boolean
   */
  private static isTotalPercentAchievements (activity): boolean {
    if (!activity.achievements || activity.achievements.length === 0) {
      return false
    }
    const totalPercent = activity.achievements.reduce(
      (a, b) => a + (b['percent'] || 0),
      0
    )

    if (totalPercent >= 100) {
      return true
    }

    return false
  }

  /**
   *
   * @param activity
   */
  private static async expiredActivity (activity) {
    const activityInstance = await Activity.findById(activity._id)

    activityInstance.setExpired()

    return activityInstance.save()
  }
}

export default CropService
