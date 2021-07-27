import CropTypeRepo from '../../repo/cropTypeRepo'
import { ICropTypeProps } from '../../interfaces'

export default class GetCropTypesUseCase {
  constructor(private cropTypeRepo: CropTypeRepo) {}

  public execute(query: object = {}): Promise<ICropTypeProps[]> {
    return this.cropTypeRepo.get(query)
  }
}
