import { GetCropTypesDTO } from '../useCase/getCropType/getCropTypesDTO'
import { INameLanguageProps } from '../../commons/interfaces'

export interface ICropTypeProps {
  name: INameLanguageProps
  key: string
}

export interface ICropTypeRepo {
  get(query: GetCropTypesDTO): Promise<ICropTypeProps[]>
}
