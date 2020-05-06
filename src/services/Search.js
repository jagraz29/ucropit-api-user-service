const Crop = require('../models').crops

class Search {
  static async getBudgetbyFields(query, field) {
    if (!this.validQuery(query))
      throw new Error('el parametro query debe especificar : {where:{...}}')
    const crop = await Crop.findOne({ ...query, raw: true })
    const budget = JSON.parse(crop.budget)

    const result = budget.items.filter((stage) => stage.form == field)

    if (result.length > 0) {
      return result
    }

    return null
  }

  static validQuery(query) {
    if (query instanceof Object && query.where) {
      return true
    }

    return false
  }
}

module.exports = Search
