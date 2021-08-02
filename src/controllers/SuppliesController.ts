'use strict'

import { Request, Response } from 'express'
import models from '../models'
import SupplyRepository from '../repositories/supplyRepository'
import { parseSuppliesWithEiqTotal } from '../utils'
import { typesSupplies } from '../utils/Constants'

const Supply = models.Supply

class SuppliesController {
  public async index(req, res: Response) {
    let type = null
    let filter: any = {}
    const { q, tag, skip, limit } = req.query
    if (tag) {
      type = typesSupplies.find((item) => item.tag === tag)
    }

    const skipSide = skip && /^\d+$/.test(skip) ? Number(skip) : 0

    if (q) {
      filter = {
        $text: { $search: q }
      }
    }

    if (type) {
      filter.typeId = { $in: type.types }
    }

    const limitSide = limit >= 0 ? Number(limit) : 15

    const supplies = await SupplyRepository.getSuppliesPaginated(
      filter,
      limitSide,
      skipSide
    )

    const lang = res.getLocale() as string
    const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(supplies, lang)
    res.status(200).json(suppliesWithEiqTotal)
  }

  public async quantity(req: Request, res: Response) {
    const { alphaCode } = req.query
    if (alphaCode) {
      const totalFilterAlphaCode = await Supply.find({
        alphaCode: alphaCode
      }).countDocuments()

      return res.status(200).json({ quantity: totalFilterAlphaCode })
    }
    const total = await Supply.countDocuments()

    return res.status(200).json({ quantity: total })
  }
}

export default new SuppliesController()
