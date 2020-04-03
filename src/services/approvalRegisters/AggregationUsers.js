'use strict'

const Approval = require('../../models').approval
const ApprovalRegister = require('../../models').approval_register
const ApprovalRegisterSign = require('../../models').approval_register_sign

class AggregationUsers {
  /**
   * Envia un array con los elementos encontrados, los arrays vacíos se descartan.
   * @param {*} usersWhithApprovals
   *
   * @return Array
   */
  static async getCropAggregationWithApprovals(crops) {
    const signAggregation = crops.map(async (crop) => {
      const result = crop.users.map(async (user) => {
        const usersApprovals = await this.userWithApprovals(crop, user)
        return {
          user: {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
          },
          usersApprovals,
        }
      })

      return {
        crop: { id: crop.id, name: crop.crop_name },
        crop_aggregations: await Promise.all(result),
      }
    })

    return await Promise.all(signAggregation)
  }

  /**
   * Busca todo los approvals de un usuario por el parámetro cropId.
   * Por cada approval cuenta la cantidad de ApprovalRegister y Sings
   * del usuario.
   *
   * @param Crop crops
   * @param User user
   *
   * @return Array
   */
  static async userWithApprovals(crop, user) {
    try {
      const approvals = await Approval.findAll({
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
      return await this.countApprovalsRegisters(approvals)
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Cuenta la cantidad de ApprovalRegister y ApprovalRegisterSings.
   *
   * @param {*} approvals
   */
  static async countApprovalsRegisters(approvals) {
    const result = approvals.map((approval) => {
      return {
        registers: approval.Register,
        signs:
          approval.Register.length > 0 ? approval.Register[0].Signs.length : 0,
      }
    })

    return {
      cantRegister: result.length,
      cantSigns: result.reduce((a, b) => a + (b['signs'] || 0), 0),
    }
  }
}

module.exports = AggregationUsers
