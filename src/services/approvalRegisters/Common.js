'use strict'

const Production = require('../../models').productions
const Crop = require('../../models').crops
const User = require('../../models').users
const Approval = require('../../models').approval
const ApprovalRegister = require('../../models').approval_register
const ApprovalRegisterSign = require('../../models').approval_register_sign
const UserPermissionsProduction = require('../../models')
  .productions_users_permissions

class Common {
  /**
   * Get production that correspond to approval register
   *
   * @param {*} approvalRegisterId
   */
  static async getProductionBy(approvalRegisterId) {
    try {
      const result = await ApprovalRegister.findOne({
        where: { id: approvalRegisterId },
        include: [{ model: Approval }],
      })

      const approval = result.approval

      return Production.findOne({ where: { crop_id: approval.crop_id } })
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Get all users to stage production by cropId filter.
   *
   * @param {*} cropId
   */
  static async getProductionPermisionsByCropId(cropId) {
    let crop = await Crop.findOne({
      where: { id: cropId },
      include: [
        {
          model: User,
        },
      ],
    })

    let productionPermissions = crop.users.map(async (user) => {
      const cropUserPermissionsProduction = await UserPermissionsProduction.findOne(
        {
          where: { user_id: user.id, production_id: cropId },
        }
      )

      if (cropUserPermissionsProduction) {
        return {
          user_id: user.id,
          permissions: JSON.parse(cropUserPermissionsProduction.data),
        }
      }
    })

    return await Promise.all(productionPermissions)
  }

  static async getApprovalWithRegisters(filter) {
    return await Approval.findAll({
      where: filter,
      include: [
        {
          model: ApprovalRegister,
          as: 'Register',
          include: [
            {
              model: ApprovalRegisterSign,
              as: 'Signs',
            },
          ],
        },
      ],
    })
  }

  static async getApprovalWithSingFiterUser(crop, user) {
    return await Approval.findAll({
      where: { crop_id: crop.id },
      include: [
        {
          model: ApprovalRegister,
          as: 'Register',
          include: [
            {
              model: ApprovalRegisterSign,
              as: 'Signs',
              where: { user_id: user.id },
            },
          ],
        },
      ],
    })
  }
}

module.exports = Common
