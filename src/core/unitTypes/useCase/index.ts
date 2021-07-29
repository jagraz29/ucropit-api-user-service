import unitTypeRepo from '../repo'
import GetUnitTypesUseCase from '../useCase/getUnitTypes/getUnitTypesUseCase'

const getUnitTypesUseCase = new GetUnitTypesUseCase(unitTypeRepo)

export { getUnitTypesUseCase }
