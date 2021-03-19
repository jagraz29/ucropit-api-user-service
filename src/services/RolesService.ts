import { IRoles } from '../interfaces/Roles'
import models from '../models'

const Roles = models.Roles

class RoleService {
  static async findOne (query: IRoles): Promise<IRoles> {
    return Roles.findOne(query)
  }
}

export default RoleService
