import cropTypeRepo from '../repo'
import GetCropTypesUseCase from './getCropType/getCropTypesUseCase'

const getCropTypesUseCase = new GetCropTypesUseCase(cropTypeRepo)

export { getCropTypesUseCase }
