'use strict'

const Approvals = require('../models').approval
const ApprovalRegister = require('../models').approval_register
const ApprovalRegisterSigns = require('../models').approval_register_sign
const ApprovalRegisterFiles = require('../models').approval_register_file

class ApprovalsController {
  static async show({ cropId, stage, type, typeId }) {
    try {
      const approval = await Approvals.findOne({
        where: {
          stage: stage,
          crop_id: cropId,
          service_id: type === 'service' ? typeId : null,
          input_id: type === 'input' ? typeId : null,
        },
        include: [
          {
            model: ApprovalRegister,
            as: 'Register',
            include: [{ model: ApprovalRegisterSigns, as: 'Signs' }],
          },
        ],
      })

      return approval
    } catch (err) {
      throw new Error(err)
    }
  }

  static async index({ cropId, stage }) {
    try {
      const approval = await Approvals.findAll({
        where: {
          stage: stage,
          crop_id: cropId,
        },
        include: [
          {
            model: ApprovalRegister,
            as: 'Register',
            include: [
              { model: ApprovalRegisterSigns, as: 'Signs' },
              { model: ApprovalRegisterFiles, as: 'Files' },
            ],
          },
        ],
      })

      return approval
    } catch (err) {
      throw new Error(err)
    }
  }

  static async create(data) {
    try {
      if (data.stage === 'fields') {
        const exists = await Approvals.findOne({
          where: { stage: data.stage, crop_id: data.crop_id },
        })

        if (!exists) {
          const approval = await Approvals.create({
            stage: data.stage,
            crop_id: data.crop_id,
          })

          await ApprovalRegister.create({
            approval_id: approval.id,
          })
          return approval
        }

        return exists
      }

      const exists = await Approvals.findOne({
        where: {
          stage: data.stage,
          crop_id: data.crop_id,
          service_id: data.service_id,
          input_id: data.input_id,
        },
      })

      if (!exists) {
        const approval = await Approvals.create(data)

        const register = await ApprovalRegister.create({
          approval_id: approval.id,
        })
      } else {
        await exists.update(data)
      }

      return exists
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = ApprovalsController
