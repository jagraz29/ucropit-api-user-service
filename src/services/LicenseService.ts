import ServiceBase from './common/ServiceBase'
import { ms_license_url } from '../types'
const MS_LICENSE_URL = `${ms_license_url}/licenses`

export interface ILicenseSearch {
  userId: string
  cropTypeId: string
}

export interface ILicenseById {
  id: string
  userId: string
  cropId: string
}

export interface ISearchAppliedLicensesByCrop {
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
        `${MS_LICENSE_URL}/${id}`,
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
   *  sign license.
   *
   * @param licenseById
   */
  public static async sign({ id, cropId, userId }) {
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'post',
        `${MS_LICENSE_URL}/${id}/sign`,
        { cropId, userId },
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
        `${MS_LICENSE_URL}/search-by-crop`,
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

  /**
   *  get applied licenses by crop.
   *
   * @param searchAppliedLicensesByCrop
   */
  public static async searchAppliedLicensesByCrop({
    id,
    userId,
    cropId
  }: ISearchAppliedLicensesByCrop) {
    return new Promise((resolve, reject) => {
      const params = {
        userId,
        cropId
      }

      this.makeRequest(
        'get',
        `${MS_LICENSE_URL}/${id}/applied-by-crop`,
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
}
