import ServiceBase from './common/ServiceBase'
import CropService from './CropService'
import ActivityService from './ActivityService'
import Numbers from '../utils/Numbers'
import _ from 'lodash'

let allMonths: Array<string> = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

class ChartDataService extends ServiceBase {
  /**
   * Generate data to Chart Agreement
   *
   * @param crops
   */
  public static generateDataAgreement (crops) {
    const listSummarySurfaces: any = CropService.createDataCropToChartSurface(
      crops
    )

    const sortDataList = this.sortData(listSummarySurfaces, allMonths).filter(
      (item) => item.total > 0
    )

    const summarySortData = this.summaryTotalPerMonth(
      CropService.summaryData(sortDataList)
    )

    const labels: any = summarySortData.map((item) => item.date)
    const data: any = summarySortData.map((item) =>
      Numbers.roundToTwo(item.total)
    )

    return { labels, data }
  }

  /**
   * Generate Data to Chart Activities.
   *
   * @param crops
   * @param typeActivity
   */
  public static generateDataActivities (crops, typeActivity: string) {
    const groupData = crops.map((crop) => {
      const groupDataActivitiesDone = ActivityService.groupSurfaceAndDateAchievements(
        crop.done,
        typeActivity
      )
      const groupDataActivitiesFinished = ActivityService.groupSurfaceAndDateAchievements(
        crop.finished,
        typeActivity
      )

      return groupDataActivitiesDone.concat(groupDataActivitiesFinished)
    })

    const sortGroupData = this.sortData(_.flatten(groupData), allMonths)

    const dataActivitiesSummary = this.summaryTotalPerMonth(
      CropService.summaryData(sortGroupData)
    )

    const labels: any = dataActivitiesSummary.map((item) => item.date)
    const data: any = dataActivitiesSummary.map((item) =>
      Numbers.roundToTwo(item.total)
    )

    return { labels, data }
  }

  /**
   * Summary total per Month.
   *
   * @param list
   */
  private static summaryTotalPerMonth (list: Array<any>) {
    let total = 0
    return list.map((item) => {
      total += item.total

      return {
        date: item.date,
        total: total
      }
    })
  }
}

export default ChartDataService
