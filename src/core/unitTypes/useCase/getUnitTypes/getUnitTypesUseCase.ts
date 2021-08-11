import UnitTypeRepo from '../../repo/unitTypeRepo'
import { IUnitTypeProps } from '../../interfaces'
import { GetUnitTypesDTO } from './getUnitTypesDTO'

export default class GetUnitTypesUseCase {
  constructor(private unitTypeRepo: UnitTypeRepo) {}

  public execute(query: GetUnitTypesDTO = {}): Promise<IUnitTypeProps[]> {
    return this.unitTypeRepo.get(query)
  }
}
