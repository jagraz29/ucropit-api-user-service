import { Response, Request } from 'express'

import CropService from '../services/CropService'
import models from '../models'
import Numbers from '../utils/Numbers'

const Crop = models.Crop

let allMonths = [
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

class ChartController {
  /**
   * Data to Chart agreement's activity.
   *
   * @param req
   * @param res
   */
  public async surfaceActivityAgreement (req: Request, res: Response) {
    const user: any = req.user
    const query: any = {
      cancelled: false,
      'members.user': user._id
    }

    if (req.query.identifier) {
      query['members.identifier'] = req.query.identifier
    }

    const crops = await Crop.find(query)
      .populate('cropType')
      .populate('unitType')
      .populate('members.user')
      .populate({
        path: 'finished',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' }
        ]
      })
      .lean()

    const listSummarySurfaces: any = CropService.createDataCropToChartSurface(
      crops
    )

    const sortData = listSummarySurfaces.sort(function (a, b) {
      // sort based on the value in the monthNames object
      return allMonths.indexOf(a.date) - allMonths.indexOf(b.date)
    })

    let filterSortData = sortData.filter((item) => item.total > 0)

    filterSortData = CropService.summaryData(filterSortData)

    let labels: any = filterSortData.map((item) => item.date)
    let data: any = filterSortData.map((item) =>
      Numbers.roundToTwo(item.total)
    )

    return res.status(200).json({ labels, data })
  }

  /**
   * Data to volumes expected.
   *
   * @param req
   * @param res
   */
  public async volumesCrops (req, res: Response) {
    const user: any = req.user
    const query: any = {
      cancelled: false,
      'members.user': user._id
    }

    if (req.query.identifier) {
      query['members.identifier'] = req.query.identifier
    }

    const crops = await Crop.find(query).populate('unitType').lean()

    const listSummaryVolumes = CropService.getSummaryVolumes(crops)

    const sortData = listSummaryVolumes.sort(function (a, b) {
      return allMonths.indexOf(a.date) - allMonths.indexOf(b.date)
    })

    const summarySortData = CropService.summaryData(sortData)

    const labels = summarySortData.map((item) => item.date)
    const data = summarySortData.map((item) => Numbers.roundToTwo(item.total))
    const totalExpectedVolume = Numbers.roundToTwo(
      data.reduce((a, b) => a + (b || 0), 0)
    )

    return res.status(200).json({ labels, data, totalExpectedVolume })
  }

  /**
   * General data to crops.
   *
   * @param req
   * @param res
   */
  public async dataGeneralCrops (req, res: Response) {
    const user: any = req.user
    const query: any = {
      cancelled: false,
      'members.user': user._id
    }

    if (req.query.identifier) {
      query['members.identifier'] = req.query.identifier
    }

    const crops = await Crop.find(query)
      .populate('unitType')
      .populate({
        path: 'pending',
        populate: [{ path: 'lots' }]
      })
      .populate({
        path: 'toMake',
        populate: [{ path: 'lots' }]
      })
      .populate({
        path: 'done',
        populate: [{ path: 'lots' }]
      })
      .populate({
        path: 'finished',
        populate: [
          { path: 'collaborators' },
          { path: 'type' },
          { path: 'typeAgreement' },
          { path: 'lots' }
        ]
      })
      .lean()

    const generalData = crops.map((crop) => {
      const totalSurfacesExplo = CropService.sumSurfacesActivityAgreement(
        crop.finished,
        'ACT_AGREEMENTS',
        'EXPLO'
      )

      const totalSurfacesSust = CropService.sumSurfacesActivityAgreement(
        crop.finished,
        'ACT_AGREEMENTS',
        'SUSTAIN'
      )

      const totalSurfacesLots = CropService.sumSurfacesByLot(crop)

      return {
        total_sust: totalSurfacesExplo,
        total_explo: totalSurfacesSust,
        total_surfaces: totalSurfacesLots
      }
    })

    const totalSus = Numbers.roundToTwo(
      generalData.reduce((a, b) => a + (b['total_sust'] || 0), 0)
    )
    const totalExplo = Numbers.roundToTwo(
      generalData.reduce((a, b) => a + (b['total_explo'] || 0), 0)
    )
    const totalKmz = Numbers.roundToTwo(
      generalData.reduce((a, b) => a + (b['total_surfaces'] || 0), 0)
    )

    return res.status(200).json({ totalSus, totalExplo, totalKmz })
  }
}

export default new ChartController()
