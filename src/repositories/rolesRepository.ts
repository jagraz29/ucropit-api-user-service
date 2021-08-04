import models from '../models'
import { RolesDocument } from '../models/Roles'

const { Roles } = models

export class RolesRepository {
  /**
   * Get all roles
   *
   * @returns
   */
  public static async getAll(): Promise<RolesDocument[]> {
    return Roles.find({}).lean()
  }
}
