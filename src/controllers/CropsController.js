"use strict";

const Crop = require("../models").crops;
const CropTypes = require("../models").crop_types;
const Fields = require("../models").fields;
const Users = require("../models").users;
const CropUserPermissions = require("../models").crop_user_permissions;
const CropPermissions = require("../models").crop_permissions;
const CropUsers = require("../models").crop_users;
const Mail = require('../services/Mail')
const { getShortYear } = require('../helpers')

class CropsController {
  static async index(auth) {
    try {
      return await Crop.findAll({
        include: [
          { model: CropTypes },
          { model: Fields },
          { model: Users, where: { id: auth.user.id } }
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
      const crop = await Crop.findOne({
        where: { id: id },
        include: [{ model: CropTypes }, { model: Fields }, { model: Users }]
      })

      const cropUsersId = crop.users.find(el => el.id === auth.user.id).crop_users.id

      const cropUsers = await CropUsers.findOne({
        where: { id: cropUsersId },
        include: [{ model: CropPermissions }]
      })

      return {
        ...crop.get({ 'plain': true }),
        permissions: cropUsers.crop_permissions
      }
    } catch (err) {
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

      return await crop.update(data)
    } catch (err) {
      throw new Error(err)
    }
  }

  static async budget(id, data) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      })
      console.log(data)
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

