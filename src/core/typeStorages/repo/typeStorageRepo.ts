import { ITypeStorageProps, ITypeStorageRepo } from '../interfaces'
import { GetTypeStoragesDTO } from '../useCase/getTypeStorages/getTypeStoragesDTO'

export default class TypeStorageRepo implements ITypeStorageRepo {
  constructor(private TypeStorageModel: any) {}

  async get(query: GetTypeStoragesDTO): Promise<ITypeStorageProps[]> {
    return this.TypeStorageModel.find(query).lean()
  }
}
