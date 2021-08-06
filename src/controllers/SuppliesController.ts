'use strict'

import { Request, Response } from 'express'
import models from '../models'
import { SupplyTypeRepository, SupplyRepository } from '../repositories'
import { parseSuppliesWithEiqTotal } from '../utils'
import { TypeActivities } from '../interfaces/activities/TypeActivities.enum'
import { IQuerySupplyType } from '../interfaces'

const Supply = models.Supply

class SuppliesController {
  public async index(req, res: Response) {
    let filter: any = {}
    const filterSupplyType: IQuerySupplyType = {}
    let supplyTypesFilter: String[] = []
    const { queryFiltering, activityType, skip, limit, alphaCode, cropType } =
      req.query

    const skipSide = skip && /^\d+$/.test(skip) ? Number(skip) : 0

    if (alphaCode) {
      filter.alphaCode = alphaCode
    }

    if (activityType === TypeActivities.ACT_SOWING) {
      filterSupplyType.activities = activityType
      filterSupplyType.cropTypes = cropType
    } else {
      filterSupplyType.activities = activityType
    }

    if (activityType || cropType) {
      supplyTypesFilter = (
        await SupplyTypeRepository.getAllByQuery(filterSupplyType)
      ).map((supplyType) => supplyType._id)

      filter.typeId = { $in: supplyTypesFilter }
    }

    if (queryFiltering) {
      filter = {
        $text: { $search: queryFiltering }
      }
    }

    const limitSide = limit >= 0 ? Number(limit) : 15

    const supplies = await SupplyRepository.getSuppliesPaginated(
      filter,
      limitSide,
      skipSide,
      activityType
    )

    const lang = res.getLocale() as string
    const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(supplies, lang)
    res.status(200).json(suppliesWithEiqTotal)
  }

  public async quantity(req: Request, res: Response) {
    const { alphaCode } = req.query

    const total = await Supply.find({
      alphaCode: alphaCode ?? undefined
    }).countDocuments()

    return res.status(200).json({ quantity: total })
  }
}

export default new SuppliesController()
