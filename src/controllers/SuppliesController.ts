'use strict'

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import models from '../models'
import { SupplyTypeRepository, SupplyRepository } from '../repositories'
import { parseSuppliesWithEiqTotal } from '../utils'
import { TypeActivities } from '../interfaces/activities/TypeActivities.enum'
import { IQuerySupplyType } from '../interfaces'

const Supply = models.Supply

class SuppliesController {
  public async index(req, res: Response) {
    let filter: any = {}
    let sort = {}
    const filterSupplyType: IQuerySupplyType = {}
    let supplyTypesFilter: String[] = []
    const { queryFiltering, activityType, skip, limit, alphaCode, cropType } =
      req.query

    const limitSide = limit > 0 ? Number(limit) : 15
    const skipSide = skip && /^\d+$/.test(skip) ? Number(skip) : 0

    if (alphaCode) {
      filter.alphaCode = alphaCode
    }

    if (activityType) {
      filterSupplyType.activities = activityType
      if (activityType === TypeActivities.ACT_SOWING) {
        filterSupplyType.cropTypes = cropType
        sort = { supplyType: -1 }
      }
    }

    if (Object.keys(filterSupplyType).length) {
      const supplyTypes = await SupplyTypeRepository.getAllByQuery(
        filterSupplyType
      )
      supplyTypesFilter = supplyTypes.map((supplyType) => supplyType._id)

      filter.typeId = { $in: supplyTypesFilter }
    }

    if (queryFiltering) {
      filter = {
        ...filter,
        $text: { $search: queryFiltering }
      }
    } else {
      if (alphaCode) {
        filter = {
          ...filter,
          $text: { $search: alphaCode }
        }
      }
    }

    const supplies = await SupplyRepository.getSuppliesPaginated(
      filter,
      limitSide,
      skipSide,
      activityType,
      sort
    )

    const lang = res.getLocale() as string
    const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(supplies, lang)
    if (suppliesWithEiqTotal.length) {
      // here you can define period in second, this one is 5 minutes
      const period = 1000 * 5
      res.set('Cache-Control', `public, max-age=${period}`)
    }

    res.status(StatusCodes.OK).json(suppliesWithEiqTotal)
  }

  public async quantity(req: Request, res: Response) {
    const { alphaCode } = req.query

    const total = await Supply.find({
      alphaCode: alphaCode ?? undefined
    }).countDocuments()

    return res.status(StatusCodes.OK).json({ quantity: total })
  }
}

export default new SuppliesController()
