import TypeStorageRepo from '../../repo/typeStorageRepo'
import { ITypeStorageProps } from '../../interfaces'

export default class GetTypeStoragesUseCase {
  constructor(private typeStorageRepo: TypeStorageRepo) {}

  public execute(query: object = {}): Promise<ITypeStorageProps[]> {
    return this.typeStorageRepo.get(query)
  }
}
