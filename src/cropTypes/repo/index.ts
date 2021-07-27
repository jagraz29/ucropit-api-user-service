import CropTypeRepo from './cropTypeRepo'
import models from '../../models'

const cropTypeRepo = new CropTypeRepo(models.CropType)

export default cropTypeRepo
