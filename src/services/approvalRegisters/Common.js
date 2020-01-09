'use strict'

const ApprovalRegister = require('../../models').approval_register
const Approval = require('../../models').approval
const Production = require('../../models').productions

class Common {
  /**
   * Get production that correspond to approval register
   *
   * @param {*} approvalRegisterId
   */
  static async getProductionBy (approvalRegisterId) {
    try {
      const result = await ApprovalRegister.findOne({
        where: { id: approvalRegisterId },
        include: [{ model: Approval }]
      })

      const approval = result.approval

      return Production.findOne({ where: { crop_id: approval.crop_id } })
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = Common
