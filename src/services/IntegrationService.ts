import ServiceBase from './common/ServiceBase'
import models from '../models'

const IntegrationLog = models.IntegrationLog

interface IExportCrop {
  identifier: String | string
  erpAgent: String | string
  crops?: Array<String | string | any>
  token?: String | string
  achievementId?: String | string | any
  activityId?: String | string | any
}

interface IExportIntegration {
  ucropitCompanyId: String | string
  identifier: String | string
  erpAgent: String | string
  user?: String | string
  password?: String | string
}

const dummyDataResponse = false

class IntegrationService extends ServiceBase {
  /**
   *
   * @param data
   */
  public static create(data: IExportIntegration, target: string) {
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'post',
        target,
        data,
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
   *
   * @param data
   */
  public static export(data: IExportCrop, target: string) {
    if (dummyDataResponse) {
      return this.dummyResponse(data)
    }
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'post',
        target,
        data,
        (result) => resolve(result.data),
        (err) => reject(err)
      )
    })
  }

  /**
   * Create Log Integration.
   *
   * @param any data
   * @param string cropId
   * @param string activityId
   * @param string achievementId
   *
   * @returns Promise
   */
  public static createLog(
    data: any,
    cropId?: string,
    activityId?: string,
    achievementId?: string
  ): Promise<any> {
    return IntegrationLog.create({
      log: data,
      crop: cropId,
      activity: activityId,
      achievement: achievementId
    })
  }

  private static dummyResponse(data) {
    return data.crops.map((item) => {
      return {
        cropId: item.id,
        erpAgent: 'auravant',
        fullyProcessed: true
      }
    })
  }
}

export default IntegrationService
