'use strict'

const Crop = require('../models').crops
const CropTypes = require('../models').crop_types
const Production = require('../models').productions
const ProductionStage = require('../models').production_stage
const ProductionFactory = require('../factories/ProductionFactory')

class ProductionController {
  static async index(crop) {
    try {
      return await Production.findOne({
        where: { crop_id: crop },
        include: [{ model: Crop, include: [{ model: CropTypes }] }, { model: ProductionStage, as: 'Stage' }]
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  static async storeStageData (crop, stage, data) {
    const production = await Production.findOne({
      where: { crop_id: crop }
    })

    const productionStage = await ProductionStage.findOne({
      where: { label: stage, production_id: production.id }
    })

    await productionStage.update({ data: JSON.stringify(data), status: 'done' })

    return productionStage
  }

  static async generate (id) {
    try {
      const crop = await Crop.findOne({ where: { id } })
      const budget = JSON.parse(crop.budget)

      const production = await Production.create({ crop_id: id })

      const factory = new ProductionFactory(id)

      const promises = budget.items.map(async item => {
        factory.stage = item
        return production.createStage(factory.generate)
      })

      const stages = await Promise.all(promises)

      await crop.update({ status: 'accepted' })

      return stages
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
}

module.exports = ProductionController
