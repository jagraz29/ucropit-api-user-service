import { GetTypeStoragesDTO } from '../useCase/getTypeStorages/getTypeStoragesDTO'
import { INameLanguageProps } from '../../commons/interfaces'

export interface ITypeStorageProps {
  name: INameLanguageProps
  type: string
  goalReach: number
  image: string
  key: string
}

export interface ITypeStorageRepo {
  get(query: GetTypeStoragesDTO): Promise<ITypeStorageProps[]>
}
