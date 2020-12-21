'use strict'

import { Request, Response } from 'express'
import models from '../models'

const Supply = models.Supply

class SuppliesController {
  public async index (req, res: Response) {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0

    const filter = req.query.q
      ? { name: { $regex: new RegExp('^' + req.query.q.toLowerCase(), 'i') } }
      : {}

    const supplies = await Supply.find(filter, undefined, {
      skip,
      limit: 15
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
