import ServiceBase from './common/ServiceBase'

interface IExportCrop {
  identifier: String | string
  erpAgent: String | string
  crops?: Array<String | string | any>
  token?: String | string
  achievementId?: String | string | any
  activityId?: String | string | any
}

class ExporterService extends ServiceBase {
  /**
   *
   * @param data
   */
  public static export(data: IExportCrop, target: string) {
    return new Promise((resolve, reject) => {
      this.makeRequest('post', target, data, (result) => resolve(result.data))
    })
  }
}

export default ExporterService
