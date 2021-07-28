import CropTypeRepo from '../../repo/cropTypeRepo'
import { ICropTypeProps } from '../../interfaces'
import { GetCropTypesDTO } from './getCropTypesDTO'

export default class GetCropTypesUseCase {
  constructor(private cropTypeRepo: CropTypeRepo) {}

  public execute(query: GetCropTypesDTO = {}): Promise<ICropTypeProps[]> {
    return this.cropTypeRepo.get(query)
  }
}
