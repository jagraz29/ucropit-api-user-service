import { SubTypeActivityModel } from '../models'
import { ISubTypeActivityDocument } from '../interfaces'

export class SubTypeActivityRepository {
  public static async getAll(): Promise<ISubTypeActivityDocument[]> {
    return SubTypeActivityModel.find()
  }
}
