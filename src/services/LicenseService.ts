import ServiceBase from './common/ServiceBase'
import { ms_license_url } from '../types'
import { ILicenseProps } from '../interfaces'
const base_url = `${ms_license_url}/licenses`

export interface ILicenseSearch {
  userId: string,
  cropTypeId: string,
}

export interface ILicenseById {
  userId: string,
  id: string,
}

export class LicenseService extends ServiceBase {
    /**
   *  create new license.
   *
   * @param licenseById
   */
     public static async licensebyId({userId, id} : ILicenseById) {
      try {        
        return this.makeRequestES6(
          'get',
          `${base_url}/${id}`,
          null,
          {userId})
      } catch (error) {
        throw new Error(error)
      }
  
    }
  /**
   *  create new license.
   *
   * @param licenseSearch
   */
     public static async searchByCropType(licenseSearch/* : ILicenseSearch */) {
      try {        
        return this.makeRequestES6(
          'get',
          `${base_url}/search-by-crop`,
          null,
          licenseSearch)
      } catch (error) {
        throw new Error(error)
      }
  
    }
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
