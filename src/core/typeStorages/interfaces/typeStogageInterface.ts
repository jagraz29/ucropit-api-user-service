import { GetTypeStoragesDTO } from '../useCase/getTypeStorages/getTypeStoragesDTO'

export interface ITypeStorageProps {
  name: string[]
  type: string
  goalReach: number
  image: string
}

export interface ITypeStorageRepo {
  get(query: GetTypeStoragesDTO): Promise<ITypeStorageProps[]>
}
