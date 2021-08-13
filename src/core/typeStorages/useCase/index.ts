import typeStorageRepo from '../repo'
import GetTypeStoragesUseCase from '../useCase/getTypeStorages/getTypeStoragesUseCase'

const getStorageTypesUseCase = new GetTypeStoragesUseCase(typeStorageRepo)

export { getStorageTypesUseCase }
