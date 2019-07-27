'use strict'

const { map } = require('lodash')
const StageValidator = require('../validators/StageValidator')

class ProductionFactory {
  set stage (item) {
    this._stage = item
  }

  get generate () {
    const budget = this._getBudgetAmount()
    const { name, form, data } = this._stage

    return {
      name: name,
      label: form,
      data: JSON.stringify(data),
      budget,
      display: StageValidator.isActive(form),
      status: form === 'fields' ? 'in_progress' : 'pending'
    }
  }

  _getBudgetAmount () {
    const budget = map(this._stage.data)
      .reduce((prev, { amount, total }) => {
        return prev + Number(amount)
      }, 0)

    return budget
  }
}

module.exports = ProductionFactory
