import models from '../models'
import { ServiceIntegrationDocument } from '../models/serviceIntegration'

const { ServiceIntegration } = models

export class ServiceIntegrationRepository {
  /**
   * Get all roles
   *
   * @returns
   */
  public static async getAll(): Promise<ServiceIntegrationDocument[]> {
    return ServiceIntegration.find({}).lean()
  }
}
