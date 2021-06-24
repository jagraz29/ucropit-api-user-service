import ServiceBase from './common/ServiceBase'
import { ms_license_url } from '../types'
import { ILicenseProps } from '../interfaces'
const base_url = `${ms_license_url}/licenses`

export class LicenseService extends ServiceBase {
  /**
   *  create new license.
   *
   * @param license
   */
  public static async createLicense(license: ILicenseProps) {
    try {
      return this.makeRequestES6(
        'post',
        base_url,
        license)
    } catch (error) {
      throw new Error(error)
    }

  }
}
