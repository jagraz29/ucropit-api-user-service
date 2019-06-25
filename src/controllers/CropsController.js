"use strict";

const Crop = require("../models").crops;
const CropTypes = require("../models").crop_types;
const Fields = require("../models").fields;
const Users = require("../models").users;
const CropUserPermissions = require("../models").crop_user_permissions;
const CropPermissions = require("../models").crop_permissions;
const CropUsers = require("../models").crop_users;
const Signs = require("../models").signs;
const Mail = require('../services/Mail')
const { getShortYear } = require('../helpers')
const { map, isEqual } = require('lodash')
const { diff } = require('deep-object-diff')

class CropsController {
  static async index(auth) {
    try {
      return await Crop.findAll({
        include: [
          { model: CropTypes },
          { model: Fields },
          {
            model: Users,
            where: { id: auth.user.id },
          }
        ]
      })
    } catch (err) {
      throw new Error(err)
    }
  }


  static async colaborators(cropId, values, auth) {
    try {
      let user = await Users.findOne({
        where: {
          'email': values.email
        }
      })

      const crop = await Crop.findOne({
        where: { id: cropId },
        include: [{ model: CropTypes }]
      })

      const cropName = `${crop.crop_type.name} ${getShortYear(crop.start_at)}/${getShortYear(crop.end_at)}`

      if (!user) {
        user = await Users.create({
          email: values.email,
          password: values.email,
          first_login: 0
        })

        Mail.send({ template: 'new_colaborator', to: user.email, data: { user, cropName } })
      } else {
        Mail.send({ template: 'colaborator', to: user.email, data: { user, cropName, owner: auth.user } })
      }

      await crop.addUsers(user)

      const rel = await CropUsers.findOne({
        where: { user_id: user.id, crop_id: crop.id }
      })

      if (values.can_edit) {
        await CropUserPermissions.create({
          crop_permission_id: 1,
          crop_user_id: rel.id
        })
      }

      if (values.can_sign) {
        await CropUserPermissions.create({
          crop_permission_id: 2,
          crop_user_id: rel.id
        })
      }

      return crop
    } catch (err) {
      throw new Error(err)
    }
  }

  static async types() {
    try {
      return await CropTypes.findAll()
    } catch (err) {
      throw new Error(err)
    }
  }

  static async show(id, auth) {
    try {
      let crop = await Crop.findOne({
        where: { id: id },
        include: [
          { model: CropTypes },
          { model: Fields },
          {
            model: Users,
            include: [
              {
                model: Signs
              },
            ]
          }
        ]
      })

      const cropUsersId = crop.users.find(el => el.id === auth.user.id).crop_users.id
      const cropUsers = await CropUsers.findOne({
        where: { id: cropUsersId },
        include: [{ model: CropPermissions }]
      })

      const plainCrops = crop.get({ plain: true })

      const canSign = []

      crop = {
        ...plainCrops,
        users: await Promise.all(plainCrops.users.map(async el => {
          const permissions = await CropUserPermissions.findAll({
            where: { crop_user_id: el.id },
            include: [{ model: CropPermissions }]
          })

          const signable = permissions.find(el => el.crop_permission.value === 'can_sign')

          if (signable !== undefined) {
            canSign.push(el)
          }

          return { ...el, permissions }
        }))
      }

      crop.editable = canSign.filter(el => el.signs.length > 0).length !== canSign.length

      return {
        ...crop,
        permissions: cropUsers.crop_permissions
      }
    } catch (err) {
      console.log('CROP_SHOW', err)
      throw new Error(err)
    }
  }

  static async create(data, auth) {
    try {
      const crop = await Crop.create({
        ...data,
        budget: JSON.stringify({
          items: [
            { id: 1, name: 'Campo', data: {}, status: 'in_progress', form: 'fields' },
            { id: 2, name: 'Pre-Siembra', data: {}, status: 0, form: 'pre-sowing' },
            { id: 3, name: 'Siembra', data: {}, status: 0, form: 'sowing' },
            { id: 4, name: 'Protección de Cultivos', data: {}, status: 0, form: 'protection' },
            { id: 5, name: 'Cosecha y Comercialización', data: {}, status: 0, form: 'harvest-and-marketing' },
            { id: 6, name: 'Gastos administrativos', data: {}, status: 0, form: 'other-expenses' },
          ]
        })
      })


      let rel = await crop.setUsers([auth.user.id])
      rel = rel[0][0]

      await CropUserPermissions.create({
        crop_permission_id: 1,
        crop_user_id: rel.id
      })

      await CropUserPermissions.create({
        crop_permission_id: 2,
        crop_user_id: rel.id
      })

      return crop
    } catch (err) {
      throw new Error(err)
    }
  }

  static async update(id, data) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      })

      let newBudget = JSON.parse(crop.budget)
      newBudget = {
        ...newBudget,
        items: map(newBudget.items, (el) => {
          if (el.form === 'other-expenses') {
            const totalExpenses = el.data.undefined.expenses.reduce((prev, el) => prev + parseFloat(el.cost.replace(/[, ]+/g, '')), 0)
            const totalIncome = el.data.undefined.income.reduce((prev, el) => prev + parseFloat(el.cost.replace(/[, ]+/g, '')), 0)
            el.data['undefined'].amount = ((totalIncome - totalExpenses) / data.surface).toFixed(2)
          } else if (el.form === 'harvest-and-marketing') {
            let newData = {}
            for (let item in el.data) {
              let total = Number(el.data[item].price)
              if (el.data[item].concept.calc_unit === 'ha') {
                total = total
              } else if (el.data[item].concept.calc_unit === 'percent') {
                total = ((crop.reference_price * crop.quintals) * total) / 100
              } else if (el.data[item].concept.calc_unit === 'ton') {
                total = total * crop.quintals
              }

              el.data[item].amount = total

              newData = {
                ...el.data,
                [item]: el.data[item]
              }
            }
            el.data = newData
          }
          return el
        })
      }

      await Signs.destroy({
        where: { type_id: id, type: 'crop-budget' }
      })

      return await crop.update({
        ...data,
        budget: JSON.stringify(newBudget)
      })
    } catch (err) {
      console.log(err)
      throw new Error(err)
    }
  }

  static async budget(id, data) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      })

      const diffBudget = diff(JSON.parse(crop.budget), data).items

      if (diffBudget !== undefined) {
        if (diffBudget[Object.keys(diffBudget)[0]].data !== undefined) {
          await Signs.destroy({
            where: { type_id: crop.id, type: 'crop-budget' }
          })
        }
      }

      return await crop.update({ budget: JSON.stringify(data) })
    } catch (err) {
      throw new Error(err)
    }
  }

  static async delete(id) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      })

      return await crop.destroy()
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = CropsController

