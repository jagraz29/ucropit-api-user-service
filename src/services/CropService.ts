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
    name: 'COMPLETAR',
    cropStatus: 'pending'
  },
  {
    name: 'PLANIFICADA',
    cropStatus: 'toMake'
  },
  {
    name: 'REALIZADA',
    cropStatus: 'done'
  },
  {
    name: 'TERMINADA',
    cropStatus: 'finished'
  }
]

class CropService {
  public static async handleDataCrop (data, company, lots, activities, user) {
    const lotsIds = []

    for (const lot of lots) {
      lotsIds.push(lot._id)
    }

    data.lots = lotsIds
    data.company = company._id
    data.owner = user._id
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
      (item) => item.name === activity.status[0].name.es
    )

    const statusCrop = status.cropStatus
    crop[statusCrop].push(activity._id)
    return crop.save()
  }
}

export default CropService
