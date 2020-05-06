'use strict'

const { map } = require('lodash')
const StageValidator = require('../validators/StageValidator')
const uuidv1 = require('uuid/v1')

class ProductionFactory {
  set stage(item) {
    this._stage = item
  }

  set stages(items) {
    this._stages = items
  }

  set permissions(permissions) {
    this._permissions = permissions
  }

  set owner(owner) {
    this._owner = owner
  }

  set stateCrop(state) {
    this._state = state
  }

  get generate() {
    const budget = this._getBudgetAmount()
    const { name, form, data } = this._stage

    const mappedData = map(data, (el) => {
      if (form === 'other-expenses') {
        const expenses = el.expenses.map((el) => {
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
                name: 'Gastos',
                image: 'Tractor.svg',
              },
            },
          }
        })

        const incomes = el.income.map((el) => {
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
                name: 'Ingresos',
                image: 'Tractor.svg',
              },
            },
          }
        })

        return [...expenses, ...incomes]
      } else {
        el.status = 'pending'
        return el
      }
    })

    return {
      name: name,
      label: form,
      data: JSON.stringify(
        form === 'other-expenses' ? mappedData[0] : mappedData
      ),
      budget,
      display: StageValidator.isActive(form),
      order: StageValidator.getOrder(form),
      status: 'in_progress',
    }
  }

  get generatePermissions() {
    let events = []
    const stages = this._stages.map((stage) => {
      if (this._owner) {
        return {
          label: stage.name,
          key: stage.label,
          permissions: {
            can_edit: true,
            can_sign: true,
            can_read: true,
          },
        }
      } else {
        return {
          label: stage.name,
          key: stage.label,
          permissions: {
            can_read: true,
            can_edit: this._getPermissionUser(1),
            can_sign: this._getPermissionUser(2),
          },
        }
      }
    })

    events = this._stages.map((stage) => {
      let eventsPermissions = null
      if (this._owner) {
        eventsPermissions = {
          field_id: 'all',
          type: 'all',
          stage: stage.name,
          label: stage.label,
          permissions: {
            can_read: true,
            can_edit: true,
            can_sign: true,
          },
        }
      } else {
        eventsPermissions = this._getPermissionsEvent(stage)
      }

      let data = {
        label: stage.label,
        stage: stage.name,
        owner: this._owner,
      }

      data.events = eventsPermissions

      return data
    })

    events = events.filter((element) => element)

    return {
      stages: [...stages],
      events: [...events],
    }
  }

  _getPermissionsEvent(stage) {
    let event = false
    if (this._state === 'planing') {
      event =
        JSON.parse(stage.data).length > 0 &&
        JSON.parse(stage.data).map((element) => {
          return {
            field_id: element.field_id,
            type: element.type,
            stage: stage.name,
            label: stage.label,
            permissions: {
              can_read: true,
              can_edit: this._getPermissionUser(1),
              can_sign: this._getPermissionUser(2),
            },
          }
        })
    }

    return event
  }

  _getBudgetAmount() {
    const budget = map(this._stage.data).reduce((prev, { amount }) => {
      return prev + Number(amount)
    }, 0)

    return budget
  }

  _getPermissionUser(permission) {
    const is_permission = this._permissions.find(
      (el) => el.crop_permission_id == permission
    )

    return is_permission ? true : false
  }
}

module.exports = ProductionFactory
