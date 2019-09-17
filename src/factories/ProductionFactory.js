'use strict'

const { map } = require('lodash')
const StageValidator = require('../validators/StageValidator')

class ProductionFactory {
  set stage(item) {
    this._stage = item
  }

  get generate() {
    const budget = this._getBudgetAmount()
    const { name, form, data } = this._stage

    return {
      name: name,
      label: form,
      data: JSON.stringify(map(data, el => {
        if (form === 'other-expenses') {
          el.expenses.map(el => {
            el.status = 'pending'
            return el
          })

          el.income.map(el => {
            el.status = 'pending'
            return el
          })

          return el
        } else {
          el.status = 'pending'
          return el
        }
      })),
      budget,
      display: StageValidator.isActive(form),
      order: StageValidator.getOrder(form),
      status: 'in_progress'
    }
  }

  _getBudgetAmount() {
    const budget = map(this._stage.data)
      .reduce((prev, { amount, total }) => {
        return prev + Number(amount)
      }, 0)

    return budget
  }
}

module.exports = ProductionFactory
