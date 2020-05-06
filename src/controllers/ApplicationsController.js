'use strict'

const Production = require('../models').productions
const ProductionStage = require('../models').production_stage

class ApplicationsController {
  static async create(crop, stage) {
    const production = await Production.findOne({ where: { crop_id: crop } })

    const prodStage = await ProductionStage.findOne({
      where: { production_id: production.id, label: stage },
    })
    const nextStage = await ProductionStage.findOne({
      where: { order: prodStage.order + 1 },
    })

    if (nextStage && nextStage.status !== 'done') {
      await nextStage.update({ status: 'in_progress' })
    }

    return true
  }
}

module.exports = ApplicationsController
