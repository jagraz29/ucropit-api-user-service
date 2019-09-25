'use strict'

const { map } = require('lodash')
const StageValidator = require('../validators/StageValidator')
const uuidv1 = require('uuid/v1')

class ProductionFactory {
  set stage(item) {
    this._stage = item
  }

  get generate() {
    const budget = this._getBudgetAmount()
    const { name, form, data } = this._stage

    const mappedData = map(data, el => {
      if (form === 'other-expenses') {
        const expenses = el.expenses.map(el => {
          const id = uuidv1()
          return {
            id,
            field_id: id,
            type: 'service',
            conceptType: 'expenses',
            price: el.cost,
            status: 'pending',
            concept: {
              id,
              name: el.detail,
              stage: 'other-expenses',
              type_id: id,
              service_type: {
                id: id,
                name: "Gastos",
                image: "Tractor.svg"
              }
            },
          }
        })

        const incomes = el.income.map(el => {
          const id = uuidv1()
          return {
            id,
            field_id: id,
            type: 'service',
            conceptType: 'incomes',
            price: el.cost,
            status: 'pending',
            concept: {
              id,
              name: el.detail,
              stage: 'other-expenses',
              type_id: id,
              service_type: {
                id: id,
                name: "Ingresos",
                image: "Tractor.svg"
              }
            },
          }
        })


        return [
          ...expenses,
          ...incomes
        ]
      } else {
        el.status = 'pending'
        return el
      }
    })

    return {
      name: name,
      label: form,
      data: JSON.stringify(form === 'other-expenses' ? mappedData[0] : mappedData),
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
