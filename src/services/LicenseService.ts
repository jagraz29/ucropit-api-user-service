import ServiceBase from './common/ServiceBase'
import { ms_license_url } from '../types'
import { ILicenseProps } from '../interfaces'
const BASE_URL = `${ms_license_url}/licenses`

export interface ILicenseSearch {
  userId: string
  cropTypeId: string
}

export interface ILicenseById {
  userId: string
  id: string
}

export class LicenseService extends ServiceBase {
  /**
   *  create new license.
   *
   * @param licenseById
   */
  public static async licensebyId({ userId, id }: ILicenseById) {
    try {
      return this.makeRequestES6('get', `${BASE_URL}/${id}`, null, { userId })
    } catch (error) {
      throw error
    }
  }
  /**
   *  create new license.
   *
   * @param licenseSearch
   */
  public static async searchByCropType(licenseSearch) {
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'get',
        `${BASE_URL}/search-by-crop`,
        licenseSearch,
        (result) => {
          resolve(result.data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }
  /**
   *  create new license.
   *
   * @param license
   */
  public static async createLicense(license: ILicenseProps) {
    try {
      return this.makeRequestES6('post', BASE_URL, license)
    } catch (error) {
      throw error
    }
  }
}
