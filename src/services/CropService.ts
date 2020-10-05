import models from '../models'
import remove from 'lodash/remove'

const Crop = models.Crop

interface ICrop {
  name: string
  pay: Number
  surface: Number
  dateCrop: string
  dateHarvest: string
  cropType: Object
  unitType: Object
  lots: Array<any>
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
  }
]

class CropService {
  public static async handleDataCrop (data, company, lots, activities) {
    const lotsIds = []

    for (const lot of lots) {
      lotsIds.push(lot._id)
    }

    data.lots = lotsIds
    data.company = company ? company._id : null
    data.pending = activities

    return this.store(data)
  }

  public static async store (crop: ICrop) {
    return Crop.create(crop)
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
}

export default CropService
