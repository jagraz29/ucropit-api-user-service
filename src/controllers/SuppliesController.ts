'use strict'

import { Request, Response } from 'express'
import models from '../models'
import { typesSupplies } from '../utils/Constants'

const Supply = models.Supply

class SuppliesController {
  public async index (req, res: Response) {
    let type = null
    let filter: any = {}
    if (req.query.tag) {
      type = typesSupplies.find(item => item.tag === req.query.tag)
    }

    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0

    if (req.query.q) {
      filter = {
        name: { $regex: new RegExp('^' + req.query.q.toLowerCase(), 'i') }
      }
    }

    if (type) {
      filter.typeId = { $in: type.types }
    }
    
    const supplies = await Supply.find(filter, undefined, {
      skip,
      limit: req.query.limit >= 0 ? Number(req.query.limit) : 15
    })
      .populate('typeId')
      .sort('name')
      .lean()

    res.status(200).json(supplies)
  }

  public async quantity (req: Request, res: Response) {
    const total = await Supply.countDocuments()

    res.status(200).json({ quantity: total })
  }
}

export default new SuppliesController()
