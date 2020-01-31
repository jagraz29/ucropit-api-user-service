'use strict'

const Users = require('../models').users
const Crop = require('../models').crops
const CropTypes = require('../models').crop_types
const CropUsers = require('../models').crop_users
const Production = require('../models').productions
const ProductionStage = require('../models').production_stage
const CropUserPermissions = require('../models').crop_user_permissions
const CropPermission = require('../models').crop_permissions
const ProductionFactory = require('../factories/ProductionFactory')
const ProductionUserPermission = require('../models')
  .productions_users_permissions
const { getShortYear } = require('../helpers')
const DiaryUser = require('../services/DiaryUser')
const Mail = require('../services/Mail')

const _addEventColaborator = (stages, events, permissions) => {
  let stagesAdd = []
  let isSameEvent = false
  if (
    stages.filter((ele) => ele.key == permissions.stages[0].key).length == 0
  ) {
    stagesAdd = [...stages, ...permissions.stages]
  } else {
    stagesAdd = stages
  }

  let eventsAdd = events.map((el) => {
    if (el.label == permissions.events[0].label) {
      const eventsUpdate = [...el.events, permissions.events[0].events[0]]
      isSameEvent = true
      el.events = eventsUpdate
      return { ...el }
    } else {
      return { ...el }
    }
  })

  if (!isSameEvent) {
    eventsAdd = [...eventsAdd, permissions.events[0]]
  }

  return { stages: stagesAdd, events: eventsAdd }
}

const _createPermissionsToColaborator = async (
  can_sign,
  can_edit,
  cropId,
  stage,
  fieldId,
  type,
  user
) => {
  try {
    const permission = {
      stages: [
        {
          label: _getStageName(stage),
          key: stage,
          permissions: {
            can_read: true,
            can_sign: parseInt(can_sign) === 1 ? true : false,
            can_edit: parseInt(can_edit) === 1 ? true : false
          }
        }
      ],
      events: [
        {
          label: stage,
          stage: _getStageName(stage),
          owner: false,
          events: [
            {
              field_id: fieldId,
              type: type,
              stage: _getStageName(stage),
              label: stage,
              permissions: {
                can_read: true,
                can_sign: parseInt(can_sign) === 1 ? true : false,
                can_edit: parseInt(can_edit) === 1 ? true : false
              }
            }
          ]
        }
      ]
    }
    const productPermission = await ProductionUserPermission.findOne({
      where: { user_id: user.id, production_id: cropId }
    })
    if (!productPermission) {
      return await ProductionUserPermission.create({
        user_id: user.id,
        production_id: cropId,
        data: JSON.stringify(permission)
      })
    }
    // Si existe permisos lo actualiza.
    const permissionsUpdate = _addEventColaborator(
      JSON.parse(productPermission.data).stages,
      JSON.parse(productPermission.data).events,
      permission
    )

    return await productPermission.update({
      data: JSON.stringify(permissionsUpdate)
    })
  } catch (error) {
    throw new Error(error)
  }
}

const _getStageName = (key) => {
  switch (key) {
    case 'pre-sowing':
      return 'Pre-Siembra'
    case 'sowing':
      return 'Siembra'
    case 'protection':
      return 'Protección de Cultivos'
    case 'harvest-and-marketing':
      return 'Cosecha y Comercialización'
    case 'other-expenses':
      return 'Gastos administrativos'
    case 'monitoring':
      return 'Monitoreo'
    default:
      return 'Entregas'
  }
}

class ColaboratorController {
  /**
   * Se crea un colaborador y se vincula a un evento específico
   *
   * @param {*} data
   * @param {*} cropId
   * @param {*} stage
   * @param {*} fieldId
   * @param {*} type
   * @param {*} auth
   */
  static async create(data, cropId, stage, fieldId, type, auth) {
    try {
      const { email, first_name, last_name, can_sign, can_edit } = data

      let user = await Users.findOne({
        where: {
          email: email
        }
      })

      const crop = await Crop.findOne({
        where: { id: cropId },
        include: [{ model: CropTypes }]
      })

      // Aqui debería llegar un email específico
      const cropName = `${crop.crop_type.name} ${getShortYear(
        crop.start_at
      )}/${getShortYear(crop.end_at)}`

      if (!user) {
        const newUser = await Users.create({
          email: email,
          first_name: first_name,
          last_name: last_name,
          password: email,
          first_login: 0
        })

        Mail.send({
          template: 'new_colaborator',
          to: newUser.email,
          data: {
            user: newUser,
            cropName,
            owner: auth.user,
            crop_path:
              crop.status === 'accepted' ? `/productions/${crop.id}` : '',
            url: process.env.FRONT_URL
          }
        })

        await crop.addUsers(newUser)

        const rel = await CropUsers.findOne({
          where: { user_id: newUser.id, crop_id: crop.id }
        })

        await rel.update({
          is_owner: 0
        })

        // Se agrega los permisos
        await _createPermissionsToColaborator(
          can_sign,
          can_edit,
          cropId,
          stage,
          fieldId,
          type,
          newUser
        )

        // Agrego el usuario colaborador a la agenda del usuario.
        await DiaryUser.add(auth.user, newUser)

        return newUser
      }

      Mail.send({
        template: 'new_colaborator',
        to: user.email,
        data: {
          user,
          cropName,
          owner: auth.user,
          crop_path:
            crop.status === 'accepted'
              ? `/productions/${crop.id}`
              : `/planning/${crop.id}/details`,
          url: process.env.FRONT_URL
        }
      })

      const rel = await CropUsers.findOne({
        where: { user_id: user.id, crop_id: crop.id }
      })

      if (!rel) {
        await crop.addUsers(user)

        const newRel = await CropUsers.findOne({
          where: { user_id: user.id, crop_id: crop.id }
        })

        await newRel.update({
          is_owner: 0
        })
      }

      await _createPermissionsToColaborator(
        can_sign,
        can_edit,
        cropId,
        stage,
        fieldId,
        type,
        user
      )

      // Agrego el usuario colaborador a la agenda del usuario.
      await DiaryUser.add(auth.user, user)

      return user
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  /**
   * Se agrega colaborador global para la etapa de producción.
   *
   * @param {*} data
   * @param {*} crop
   * @param {*} auth
   */
  static async addColaborator(data, cropId, auth) {
    try {
      let user = await Users.findOne({
        where: {
          email: data.email
        }
      })

      const crop = await Crop.findOne({
        where: { id: cropId },
        include: [{ model: CropTypes }]
      })

      // Aqui debería llegar un email específico
      const cropName = `${crop.crop_type.name} ${getShortYear(
        crop.start_at
      )}/${getShortYear(crop.end_at)}`

      if (!user) {
        const newUser = await Users.create({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.email,
          first_login: 0
        })

        Mail.send({
          template: 'new_colaborator',
          to: newUser.email,
          data: {
            user: newUser,
            cropName,
            owner: auth.user,
            crop_path:
              crop.status === 'accepted' ? `/productions/${crop.id}` : '',
            url: process.env.FRONT_URL
          }
        })

        await crop.addUsers(newUser)

        const rel = await CropUsers.findOne({
          where: { user_id: newUser.id, crop_id: crop.id }
        })

        await rel.update({
          is_owner: 0
        })

        if (data.can_edit) {
          await CropUserPermissions.create({
            crop_permission_id: 1,
            crop_user_id: rel.id
          })
        }

        if (data.can_sign) {
          await CropUserPermissions.create({
            crop_permission_id: 2,
            crop_user_id: rel.id
          })
        }

        // Permisos de usuario etapa de producción
        if (crop.status === 'accepted') {
          await this.permissionStageProduction(rel.id, cropId, newUser)
        }

        // Agrego el usuario colaborador a la agenda del usuario.
        await DiaryUser.add(auth.user, newUser)

        return newUser
      }

      Mail.send({
        template: 'new_colaborator',
        to: user.email,
        data: {
          user,
          cropName,
          owner: auth.user,
          crop_path:
            crop.status === 'accepted' ? `/productions/${crop.id}` : '',
          url: process.env.FRONT_URL
        }
      })

      let rel = await CropUsers.findOne({
        where: { user_id: user.id, crop_id: crop.id }
      })

      if (!rel) {
        await crop.addUsers(user)

        const newRel = await CropUsers.findOne({
          where: { user_id: user.id, crop_id: crop.id }
        })

        await newRel.update({
          is_owner: 0
        })

        if (data.can_edit) {
          await CropUserPermissions.create({
            crop_permission_id: 1,
            crop_user_id: newRel.id
          })
        }

        if (data.can_sign) {
          await CropUserPermissions.create({
            crop_permission_id: 2,
            crop_user_id: newRel.id
          })
        }

        rel = newRel
      }

      // Permisos de usuario etapa de producción
      if (crop.status === 'accepted') {
        await this.permissionStageProduction(rel.id, cropId, user)
      }

      // Agrego el usuario colaborador a la agenda del usuario.
      await DiaryUser.add(auth.user, user)

      return user
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  static async permissionStageProduction(cropUserId, cropId, user) {
    try {
      const permissions = await CropUserPermissions.findAll({
        where: { crop_user_id: cropUserId },
        include: [{ model: CropPermission }]
      })

      const production = await Production.findOne({
        where: { crop_id: cropId },
        include: [{ model: ProductionStage, as: 'Stage' }]
      })

      const stagesProduction = production.Stage.map((elem) => {
        return {
          name: elem.name,
          label: elem.label,
          data: elem.data
        }
      })

      const factory = new ProductionFactory(cropId)

      factory.stages = stagesProduction.map((el) => {
        if (el.label === 'other-expenses') {
          el.data = el.data === null ? '[]' : el.data
        }
        return el
      })
      factory.permissions = permissions
      factory.owner = 0

      return await ProductionUserPermission.create({
        user_id: user.id,
        production_id: cropId,
        data: JSON.stringify(factory.generatePermissions)
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Se elimina un colaborador puntual de un evento.
   *
   * @param {*} userId
   * @param {*} cropId
   * @param {*} stage
   * @param {*} fieldId
   * @param {*} type
   */
  static async removeEvent(cropId, stage, fieldId, type, userId) {
    try {
      const productPermission = await ProductionUserPermission.findOne({
        where: { user_id: userId, production_id: cropId }
      })

      console.log(productPermission)

      const events = JSON.parse(productPermission.data)
        .events.filter((el) => Object.keys(el).length > 0)
        .map((el) => {
          if (el.events instanceof Array) {
            const eventsUpdate = el.events.map((event) => {
              if (
                event.field_id == fieldId &&
                event.type == type &&
                event.label == stage
              ) {
                return {
                  field_id: fieldId,
                  type: type,
                  stage: _getStageName(stage),
                  permissions: {
                    can_read: false,
                    can_edit: false,
                    can_sign: false
                  }
                }
              } else {
                return { ...event }
              }
            })
            el.events = eventsUpdate
            return { ...el }
          }

          if (
            el.events.field_id == fieldId &&
            el.events.type == type &&
            el.events.label == stage
          ) {
            const eventsObj = { ...el.events }
            eventsObj.permissions = {
              can_read: false,
              can_edit: false,
              can_sign: false
            }

            return { ...eventsObj }
          } else {
            return { ...el.events }
          }
        })

      let stages = JSON.parse(productPermission.data).stages

      stages = stages.map((el) => {
        if (el.key === 'fields') {
          el.permissions = {
            can_read: false,
            can_edit: false,
            can_sign: false
          }
        }
        return el
      })

      const permissions = {
        stages: [...stages],
        events: [...events]
      }

      return await productPermission.update({
        data: JSON.stringify(permissions)
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Delete user to crop.
   *
   * @param {*} userId
   * @param {*} cropId
   */
  static async remove(userId, cropId) {
    try {
      const rel = await CropUsers.findOne({
        where: { user_id: userId, crop_id: cropId }
      })

      const productPermission = await ProductionUserPermission.findOne({
        where: { user_id: userId, production_id: cropId }
      })

      const sing = await Signs.findOne({
        where: { type_id: cropId, user_id: userId }
      })

      await rel.destroy()

      if (productPermission) {
        await productPermission.destroy()
      }

      if (sing) {
        await sing.destroy()
      }

      return true
    } catch (error) {
      throw new Error(err)
    }
  }
}

module.exports = ColaboratorController
