'use strict'

const Crop = require('../models').crops
const Production = require('../models').productions
const ProductionStage = require('../models').production_stage
const ProductionFactory = require('../factories/ProductionFactory')

class ProductionController {
  static async generate(id) {
    try {
      const crop = await Crop.findOne({ where: { id } })
      const budget = JSON.parse(crop.budget)

      const production = await Production.create({ crop_id: id })

      const factory = new ProductionFactory(id)
      
      const promises = budget.items.map(async item => {
        factory.stage = item
        return await production.createStage(factory.generate)
      })

      return await Promise.all(promises);

    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }
}

module.exports = ProductionController