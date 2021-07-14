import { IRoles } from '../interfaces'
import models from '../models'

const Roles = models.Roles

class RoleService {
  static async findOne(query: IRoles): Promise<any> {
    return Roles.findOne(query)
  }
}

export default RoleService
