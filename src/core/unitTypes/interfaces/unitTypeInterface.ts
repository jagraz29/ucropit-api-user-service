import { GetUnitTypesDTO } from '../useCase/getUnitTypes/getUnitTypesDTO'

export interface IUnitTypeProps {
  name: object
  key: string
}

export interface IUnitTypeRepo {
  get(query: GetUnitTypesDTO): Promise<IUnitTypeProps[]>
}
