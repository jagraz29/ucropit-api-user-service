'use strict'

const Approvals = require('../models').approval
const ApprovalRegister = require('../models').approval_register

class ApprovalsController {
  static async create(data) {
    const exists = await Approvals.findOne({ where: { stage: data.stage, crop_id: data.crop_id } })

    if (!exists) {
      const approval = await Approvals.create({
        stage: data.stage,
        crop_id: data.crop_id
      })

      if (data.stage === 'fields') {
        const register = await ApprovalRegister.create({
          approval_id: approval.id
        })
      }

      return approval
    }

    return exists
  }
}

module.exports = ApprovalsController