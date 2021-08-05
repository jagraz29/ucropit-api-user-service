'use strict'

import { Request, Response } from 'express'
import models from '../models'
import SupplyRepository from '../repositories/supplyRepository'
import { CropRepository } from '../repositories/cropRepository'
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

    if (cropType && tag === TypeActivities.ACT_SOWING) {
      const type = await CropRepository.findAllCropType(cropType)
      const typeObject = type.find((item) => item._id == cropType)
      const array = SupplyTypeByCropType.find(
        (item) => item.key === typeObject.name.en.toLowerCase()
      )
      filter.typeId = { $in: array.types }
    }

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
      skipSide,
      tag
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
