import ServiceBase from './common/ServiceBase'
import { ms_license_url } from '../types'
const BASE_URL = `${ms_license_url}/licenses`

export interface ILicenseSearch {
  userId: string
  cropTypeId: string
}

export interface ILicenseById {
  id: string
  userId: string
  cropId: string
}

export class LicenseService extends ServiceBase {
  /**
   *  create new license.
   *
   * @param licenseById
   */
  public static async licenseById({ id, userId, cropId }: ILicenseById) {
    return new Promise((resolve, reject) => {
      const params = {
        userId,
        cropId
      }
      this.makeRequest(
        'get',
        `${BASE_URL}/${id}`,
        { params },
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
   * @param licenseSearch
   */
  public static async searchByCropType(licenseSearch) {
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'get',
        `${BASE_URL}/search-by-crop`,
        { params: licenseSearch },
        (result) => {
          resolve(result.data)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }
}
