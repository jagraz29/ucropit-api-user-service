import ServiceBase from './common/ServiceBase'

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

const dummyDataResponse = true

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
      this.makeRequest('post', target, data, (result) => resolve(result.data))
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
