import { RequestProps } from '../interfaces/SatelliteImageRequest'
import ServiceBase from './common/ServiceBase'
import {
  SENSING_REMOTE_URL,
  SENSING_ENDPOINT_REQUEST
} from '../utils/Constants'
import { Lot } from '../models/lot'

class SatelliteImageService extends ServiceBase {
  /**
   * @param RequestProps[] RequestProps
   */
  private static requestProps: RequestProps[] = []

  /**
   * Check Props request are populated.
   *
   * @returns boolean
   */
  public static isReady(): boolean {
    if (this.requestProps.length > 0) {
      return true
    }
    return false
  }

  /**
   * Request Satellite Images for lots.
   */
  public static async send(): Promise<void> {
    if (this.isReady()) {
      return new Promise((resolve, reject) => {
        this.makeRequest(
          'post',
          `${SENSING_REMOTE_URL}${SENSING_ENDPOINT_REQUEST}`,
          this.requestProps,
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

  /**
   * Create payload to Send Request.
   *
   * @param activity
   *
   * @returns SatelliteImageService
   */
  public static createPayload(activity) {
    this.requestProps = activity.lots.map((lot: Lot) => {
      return {
        lotId: lot._id,
        harvestDate: this.formatDateHarvest(activity.dateHarvest),
        area: lot.area,
        customOptions: {
          activityId: activity._id
        }
      }
    })

    return this
  }

  /**
   * Create Format String Date Harvest.
   *
   * @param Date dateHarvest
   *
   * @returns string
   */
  private static formatDateHarvest(dateHarvest: Date): string {
    return dateHarvest.toISOString().split('T')[0].replace(/-/g, '')
  }
}

export default SatelliteImageService
