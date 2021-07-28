import { GetCropTypesDTO } from '../useCase/getCropType/getCropTypesDTO'

export interface ICropTypeProps {
  name: object
  key: string
}

export interface ICropTypeRepo {
  get(query: GetCropTypesDTO): Promise<ICropTypeProps[]>
}
