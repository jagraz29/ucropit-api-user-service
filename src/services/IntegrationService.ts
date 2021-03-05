import { Request } from 'express'
import ServiceBase from './common/ServiceBase'
import CropService from './CropService'
import AchievementService from './AchievementService'
import models from '../models'
import integrationLog from '../models/integrationLog'

const IntegrationLog = models.IntegrationLog

interface IExportCrop {
  identifier: String | string
  erpAgent: String | string
  crops?: Array<String | string | any>
  token?: String | string | any
  cropId?: String | string | any
  achievementId?: String | string | any
  activityId?: String | string | any
  user?: any
}

interface IExportIntegration {
  ucropitCompanyId: String | string
  identifier: String | string
  erpAgent: String | string
  user?: String | string
  password?: String | string
}

interface IExportIntegrationLog {
  lots: lotEntity[] | null
  supplies?: suppliyEntity[] | null
  applyForTheAgent: string
  _id: string
  erpAgentAchievementId: string
  processed: string
  fullyProcessed: string
  name: string
  ucropitAchievementId: string
  __v: string
  erpAgentResponse: string
}

interface lotEntity {
  id: string
}

interface suppliyEntity {
  id: string
}

const dummyDataResponse = false

class IntegrationService extends ServiceBase {
  /**
   * Get detail log Integration.
   *
   * @param cropId
   */
  public static async getLogIntegration(cropId: string, service: string) {
    const integrationLogs = await IntegrationLog.find({
      crop: cropId,
      'log.erpAgent': service
    })
      .sort({ _id: -1 })
      .limit(1)

    return integrationLogs
  }
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
   * @param id
   * @param logAchievement
   */
  public static async updateIntegrationLog(
    crop: string,
    logAchievement: IExportIntegrationLog
  ) {
    const integrationsLogFind = await integrationLog.findOne({ crop: crop })

    let res = await integrationsLogFind.logAchievement.push(logAchievement)
    await integrationsLogFind.save()

    return integrationLog.findOne({ crop: crop })
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
  public static updateLog(
    data: any,
    cropId?: string,
    activityId?: string,
    achievementId?: string
  ): Promise<any> {
    let dataLog = {
      log: data,
      crop: cropId,
      activity: activityId,
      achievement: achievementId
    }
    return IntegrationService.updateIntegrationLog(cropId, dataLog.log)
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

  /**
   * Integration Achievements with third party service.
   *
   * @param IExportCrop dataExport
   * @param Request req
   */
  public static async exportAchievement(dataExport: IExportCrop, req: Request) {
    const crop = await CropService.findOneCrop(dataExport.cropId)
    if (
      crop &&
      CropService.serviceCropIsSynchronized(crop, dataExport.erpAgent)
    ) {
      const token: string = req.get('authorization').split(' ')[1]

      const response = await IntegrationService.export(
        {
          token: token,
          erpAgent: dataExport.erpAgent,
          identifier: dataExport.identifier,
          achievementId: dataExport.achievementId,
          activityId: dataExport.activityId
        },
        `${process.env.ADAPTER_URL}/${process.env.ENDPOINT_EXPORTER_ACHIEVEMENTS}`
      )

      await AchievementService.changeStatusSynchronized(
        response.achievementId,
        response.erpAgent
      )

      await this.createLog(
        response,
        dataExport.cropId,
        response.activityId,
        response.achievementId
      )

      return response
    }

    return null
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
