import UnitTypeRepo from '../../repo/unitTypeRepo'
import { IUnitTypeProps } from '../../interfaces'

export default class GetUnitTypesUseCase {
  constructor(private unitTypeRepo: UnitTypeRepo) {}

  public execute(query: object = {}): Promise<IUnitTypeProps[]> {
    return this.unitTypeRepo.get(query)
  }
}
