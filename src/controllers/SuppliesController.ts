'use strict'

import { Request, Response } from 'express'
import models from '../models'
import SupplyRepository from '../repositories/supplyRepository'
import { parseSuppliesWithEiqTotal } from '../utils'
import { typesSupplies } from '../utils/Constants'
import { SupplyTypeByCropType } from '../utils/Constants'
import { TypeActivities } from '../interfaces/activities/TypeActivities.enum'

const Supply = models.Supply

class SuppliesController {
  public async index(req, res: Response) {
    let type = null
    let filter: any = {}
    const { q, tag, skip, limit, alphaCode, cropType } = req.query
    if (tag) {
      type = typesSupplies.find((item) => item.tag === tag)
    }
    const skipSide = skip && /^\d+$/.test(skip) ? Number(skip) : 0

    if (alphaCode) {
      filter.alphaCode = alphaCode
    }

    if (q) {
      filter = {
        $text: { $search: q }
      }
    }

    if (type) {
      filter.typeId = { $in: type.types }
    }

    if (cropType && tag === TypeActivities.ACT_SOWING) {
      const key = SupplyTypeByCropType.find((item) => item.key === cropType)
      filter.typeId = { $in: key.types }
    }

    const limitSide = limit >= 0 ? Number(limit) : 15

    const supplies = await SupplyRepository.getSuppliesPaginated(
      filter,
      limitSide,
      skipSide,
      tag
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
