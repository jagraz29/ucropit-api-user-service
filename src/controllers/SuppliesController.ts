'use strict'

import { Request, Response } from 'express'
import models from '../models'

const Supply = models.Supply

const types = [
  {
    tag: 'TAG_SOWING',
    types: [
      '346564643430633836343130',
      '346564643430633836343230',
      '346564643430633836343231',
      '346564643430633836343232',
      '346564643430633836343233',
      '346564643430633836343330',
      '346564643430633836343331',
      '346564643430633836343332',
      '346564643430633836343333',
      '346564643430633836343333',
      '346564643430633836343335',
      '346564643430633836343336',
      '346564643430633836343337'
    ]
  },
  {
    tag: 'ACT_APPLICATION',
    types: [
      '346564643430633836343130',
      '346564643430633836343230',
      '346564643430633836343231',
      '346564643430633836343232',
      '346564643430633836343233'
    ]
  },
  {
    tag: 'ACT_FERTILIZATION',
    types: [
      '346564643430633836343130',
      '346564643430633836343230',
      '346564643430633836343231',
      '346564643430633836343232',
      '346564643430633836343233'
    ]
  },
  {
    tag: 'ACT_TILLAGE',
    types: [
      '346564643430633836343130',
      '346564643430633836343230',
      '346564643430633836343231',
      '346564643430633836343232',
      '346564643430633836343233'
    ]
  }
]

class SuppliesController {
  public async index (req, res: Response) {
    let type = null
    let filter: any = {}
    if (req.query.tag) {
      type = types.find((item) => item.tag === req.query.tag)
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
