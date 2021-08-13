import { IUnitTypeProps, IUnitTypeRepo } from '../interfaces'
import { GetUnitTypesDTO } from '../useCase/getUnitTypes/getUnitTypesDTO'

export default class UnitTypeRepo implements IUnitTypeRepo {
  constructor(private UnitTypesModel: any) {}

  async get(query: GetUnitTypesDTO): Promise<IUnitTypeProps[]> {
    return this.UnitTypesModel.find(query).lean()
  }
}
