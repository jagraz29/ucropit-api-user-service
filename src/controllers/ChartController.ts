/* tslint:disable:await-promise */
import { Response, Request } from 'express'

import CropService from '../services/CropService'
import ChartService from '../services/ChartDataService'
import models from '../models'
import { Numbers } from '../utils'

const Crop = models.Crop

const allMonths = [
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
  public async surfaceActivityAgreement(req: Request, res: Response) {
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
          { path: 'typeAgreement' },
          { path: 'achievements' },
          { path: 'lots' }
        ]
      })
      .lean()

    const dataChartAgreement = ChartService.generateDataAgreement(crops)

    return res.status(200).json(dataChartAgreement)
  }

  public async surfaceProgressAchievements(req: Request, res: Response) {
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
        path: 'done',
        populate: [
          { path: 'type' },
          { path: 'lots' },
          { path: 'achievements', populate: [{ path: 'lots' }] }
        ]
      })
      .populate({
        path: 'finished',
        populate: [
          { path: 'type' },
          { path: 'lots' },
          { path: 'achievements', populate: [{ path: 'lots' }] }
        ]
      })
      .lean()

    const dataChartActivities = ChartService.generateDataActivities(crops)

    return res.status(200).json(dataChartActivities)
  }

  /**
   * Data to volumes expected.
   *
   * @param req
   * @param res
   */
  public async volumesCrops(req: Request, res: Response) {
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

    const listDataCrops = ChartService.sortData(
      listSummaryVolumes,
      allMonths
    ).filter((item) => item.total > 0)

    const summarySortData = CropService.summaryData(listDataCrops)

    const labels = summarySortData.map((item) => item.date)

    const totalExpectedVolume = Numbers.roundToTwo(
      summarySortData.reduce((a, b) => a + (b['total'] || 0), 0)
    )

    return res
      .status(200)
      .json({ summarySortData, labels, totalExpectedVolume })
  }

  /**
   * General data to crops.
   *
   * @param req
   * @param res
   */
  public async dataGeneralCrops(req: Request, res: Response) {
    const user: any = req.user
    const query: any = {
      cancelled: false,
      'members.user': user._id
    }

    if (req.query.identifier) {
      query['members.identifier'] = req.query.identifier
    }

    const crops: any = await Crop.find(query)
      .populate('unitType')
      .populate('lots.data')
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
        total_sust: totalSurfacesSust,
        total_explo: totalSurfacesExplo,
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
