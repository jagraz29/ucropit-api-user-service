import UnitTypeRepo from '../repo/unitTypeRepo'
import models from '../../../models'

const unitTypeRepo = new UnitTypeRepo(models.CropType)

export default unitTypeRepo
