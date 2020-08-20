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
}

class CropService {
  public static async store (crop: ICrop) {
    return Crop.create(crop)
  }
}

export default CropService
