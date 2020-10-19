import models from '../models'
import { isNowGreaterThan } from '../utils/Date'
import mongoose from 'mongoose'
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

class CropService {
  public static async getCropById (cropId: string) {
    let crop = await Crop.findById(cropId)
      .populate('lots')
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

    crop = this.expiredActivities(crop)

    return crop
  }
  public static async expiredActivities (crop: any) {
    let activities = crop.toMake.map(async (activity: any) => {
      if (this.isExpiredActivity(activity)) {
        activity.status[0].name.en = 'EXPIRED'
        activity.status[0].name.es = 'VENCIDA'

        await this.expiredActivity(activity)

        return activity
      }

      return activity
    })

    crop.toMake = await Promise.all(activities)

    return crop
  }
  public static async handleDataCrop (
    data,
    company,
    lots,
    activities,
    { members }
  ) {
    const lotsIds = []

    for (const lot of lots) {
      lotsIds.push(lot._id)
    }

    data.lots = lotsIds
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

  public static async removeActivities (
    activity,
    crop,
    statusCrop = 'pending'
  ) {
    crop[statusCrop].pull(activity._id)

    return crop.save()
  }

  public static async addActivities (activity, crop) {
    const status = statusActivities.find(
      item => item.name === activity.status[0].name.en
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

  private static isExpiredActivity (activity): boolean {
    if (
      activity.dateLimitValidation &&
      isNowGreaterThan(activity.dateLimitValidation)
    ) {
      return true
    }

    return false
  }

  private static async expiredActivity (activity) {
    const activityInstance = await Activity.findById(activity._id)

    activityInstance.setExpired()

    return activityInstance.save()
  }
}

export default CropService
