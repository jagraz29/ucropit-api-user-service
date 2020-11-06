import ServiceBase from './common/ServiceBase'
import models from '../models'

import { statusActivities } from '../utils/Status'

const Activity = models.Activity
const ActivityType = models.ActivityType
const TypeAgreement = models.TypeAgreement

interface IActivity {
  name?: String
  dateStart?: String
  dateEnd?: String
  surface?: Number
  type?: String
  crop?: String
  lots?: Array<any>
  dateLimitValidation?: String
  typeAgreement?: String
  supplies?: Array<any>
  evidences?: Array<any>
  status?: String | Array<any>
}

class ActivityService extends ServiceBase {
  public static async findActivityById (id: string) {
    return Activity.findById(id)
      .populate('type')
      .populate('typeAgreement')
      .populate({
        path: 'crop',
        populate: [
          { path: 'cropType' },
          { path: 'unitType' },
          { path: 'company' },
          { path: 'owner' }
        ]
      })
      .populate('lots')
      .populate('lotsMade')
      .populate('files')
      .populate({
        path: 'achievements',
        populate: [{ path: 'lots' }, { path: 'files' }]
      })
  }

  public static async store (activity: IActivity) {
    let statusActivity: Array<any> = []
    if (!this.existStatus(activity)) {
      statusActivity = this.createStatus('COMPLETAR')
      activity.status = statusActivity
    }

    if (this.existStatus(activity)) {
      statusActivity = this.createStatus(activity.status)
      activity.status = statusActivity
    }

    return Activity.create(activity)
  }

  public static async update (id: string, activity: IActivity) {
    let statusActivity: Array<any> = []

    if (this.existStatus(activity)) {
      statusActivity = this.createStatus(activity.status)
      activity.status = statusActivity
    }

    await Activity.findByIdAndUpdate(id, activity)

    return Activity.findOne({ _id: id })
  }

  public static async getByTag (tag: string) {
    return ActivityType.findOne({ tag })
  }

  public static createDefault (surface: number, date: string) {
    const typesActivity = ['ACT_SOWING', 'ACT_HARVEST', 'ACT_AGREEMENTS']

    const activities = typesActivity.map(async (item) => {
      const type = await this.getByTag(item)
      const typeAgreement = await TypeAgreement.findOne({ key: 'EXPLO' })
      const activity = await this.store({
        name: this.createNameActivity(type),
        surface,
        dateLimitValidation: item === 'ACT_AGREEMENTS' ? date : null,
        typeAgreement: item === 'ACT_AGREEMENTS' ? typeAgreement._id : null,
        type: type._id
      })

      return activity._id
    })

    return Promise.all(activities)
  }

  public static async changeStatus (activity, status: string) {
    const statusChanged = statusActivities(status)

    activity.status = statusChanged

    return activity.save()
  }

  public static async signUser (activity, user) {
    const signer = activity.signers.filter(
      (item) => item.userId.toString() === user._id.toString()
    )

    if (signer.length > 0) {
      const child = activity.signers.id(signer[0]._id)
      child.signed = true
    }

    await activity.save()

    return Activity.findById(activity._id).populate('lots').populate('files')
  }

  public static async isCompleteSingers (activity) {
    const signers = activity.signers.filter((item) => !item.signed)

    if (signers.length > 0) {
      return false
    }

    return true
  }

  public static async addAchievement (activity, achievement) {
    activity.achievements.push(achievement._id)

    return activity.save()
  }

  private static existStatus (activity) {
    return activity.status
  }

  private static createStatus (status) {
    return statusActivities(status)
  }

  private static createNameActivity (typeActivity) {
    return `${typeActivity.name.es}`
  }

  public static getSigners (signers: Array<any>, activity) {
    for (const signer of signers) {
      if (
        activity.signers.filter(
          (item) => item.userId.toString() === signer.userId
        ).length === 0
      ) {
        activity.signers.push(signer)
      }
    }

    return activity.signers
  }
}

export default ActivityService
