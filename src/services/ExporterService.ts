import ServiceBase from './common/ServiceBase'

interface IExportCrop {
  identifier: String | string
  erpAgent: String | string
  crops?: Array<String | string | any>
  token?: String | string
  achievementId?: String | string | any
  activityId?: String | string | any
}

const dummyDataResponse = true

class ExporterService extends ServiceBase {
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

export default ExporterService
