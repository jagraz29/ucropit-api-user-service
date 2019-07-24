'use strict'

const Crop = require('../models').crops
const Production = require('../models').productions
const ProductionFactory = require('../factories/ProductionFactory')

class ProductionController {
  static async index (crop) {
    try {
      const production = await Production.findOne({
        where: { crop_id: crop },
        include: [{ model: Crop }]
      })

      return production
    } catch (error) {
      throw new Error(error)
    }
  }

  static async generate(id) {
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
