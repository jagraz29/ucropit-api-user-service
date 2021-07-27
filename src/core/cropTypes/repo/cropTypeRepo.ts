import { ICropTypeProps, ICropTypeRepo } from '../interfaces'
import { GetCropTypesDTO } from '../useCase/getCropType/getCropTypesDTO'

export default class CropTypeRepo implements ICropTypeRepo {
  constructor(private CropTypesModel: any) {}

  async get(query: GetCropTypesDTO): Promise<ICropTypeProps[]> {
    return this.CropTypesModel.find(query).lean()
  }
}
