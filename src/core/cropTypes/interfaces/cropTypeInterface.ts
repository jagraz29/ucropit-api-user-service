import { GetCropTypesDTO } from '../useCase/getCropType/getCropTypesDTO'

export interface ICropTypeProps {
  name: string[]
  key: string
}

export interface ICropTypeRepo {
  get(query: GetCropTypesDTO): Promise<ICropTypeProps[]>
}
