'use strict'

const Approval = require('../../models').approval
const ApprovalRegister = require('../../models').approval_register
const ApprovalRegisterSign = require('../../models').approval_register_sign

class AggregationUsers {
  static async getUsersWithApprovalsAggregation(usersWhithApprovals) {
    usersWhithApprovals = await Promise.all(usersWhithApprovals)
    return usersWhithApprovals.filter((elem) => elem.approvals.length > 0)
  }

  /**
   *
   * @param Crop crops
   * @param User user
   *
   * @return Array
   */
  static async userWithApprovals(crops, user) {
    try {
      const approvalsWithSigns = crops.map(async (crop) => {
        const approvals = await Approval.findAll({
          where: { crop_id: crop.id },
          include: [
            {
              model: ApprovalRegister,
              as: 'Register',
              include: [
                {
                  model: ApprovalRegisterSign,
                  as: 'Signs'
                }
              ]
            }
          ]
        })

        const approvalsAggregation = await this.countApprovalsRegisters(
          approvals
        )

        return {
          user: user,
          aggregations: approvalsAggregation
        }
      })

      return await Promise.all(approvalsWithSigns)
    } catch (error) {
      reject(error)
    }
  }

  static async countApprovalsRegisters(approvals) {
    const result = approvals.map((approval) => {
      return {
        registers: approval.Register,
        signs: approval.Register[0].Signs.length
      }
    })

    return {
      cantRegister: result.length,
      cantSigns: result.reduce((a, b) => a + (b['signs'] || 0), 0)
    }
  }
}

module.exports = AggregationUsers
