import { GetUnitTypesDTO } from '../useCase/getUnitTypes/getUnitTypesDTO'
import { INameLanguageProps } from '../../commons/interfaces'

export interface IUnitTypeProps {
  name: INameLanguageProps
  key: string
}

export interface IUnitTypeRepo {
  get(query: GetUnitTypesDTO): Promise<IUnitTypeProps[]>
}
