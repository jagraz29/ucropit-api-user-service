import TypeStorageRepo from '../../repo/typeStorageRepo'
import { ITypeStorageProps } from '../../interfaces'
import { GetTypeStoragesDTO } from './getTypeStoragesDTO'

export default class GetTypeStoragesUseCase {
  constructor(private typeStorageRepo: TypeStorageRepo) {}

  public execute(query: GetTypeStoragesDTO = {}): Promise<ITypeStorageProps[]> {
    return this.typeStorageRepo.get(query)
  }
}
