import { GetUnitTypesDTO } from '../useCase/getUnitTypes/getUnitTypesDTO'

export interface IUnitTypeProps {
  name: string[]
  key: string
}

export interface IUnitTypeRepo {
  get(query: GetUnitTypesDTO): Promise<IUnitTypeProps[]>
}
