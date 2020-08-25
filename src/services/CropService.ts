import models from '../models'

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

class CropService {
  public static async handleDataCrop (data, company, lots) {
    const lotsIds = []

    for (const lot of lots) {
      lotsIds.push(lot._id)
    }

    data.lots = lotsIds
    data.company = company._id

    return this.store(data)
  }
  public static async store (crop: ICrop) {
    return Crop.create(crop)
  }
}

export default CropService
