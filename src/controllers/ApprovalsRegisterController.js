'use strict'

const PDF = require('../services/PDF')
const Stamp = require('../services/Stamp')
const Approvals = require('../models').approval
const ApprovalRegister = require('../models').approval_register
const ApprovalRegisterSigns = require('../models').approval_register_sign
const ApprovalRegisterFiles = require('../models').approval_register_file

class ApprovalsRegisterController {
  static async show(crop, stage) {
    const approval = await Approvals.findOne({ where: { stage: stage, crop_id: crop } })

    const register = ApprovalRegister.findOne({
      where: { approval_id: approval.id },
      include: [
        { model: ApprovalRegisterSigns, as: 'Signs' },
        { model: ApprovalRegisterFiles, as: 'Files' }
      ]
    })

    return register
  }

  static async sign(data, crop, stage, auth) {
    const { hash, path } = await PDF.generate({
      data: {
        time: new Date()
      },
      template: 'templates/sign-receipt.pug',
      path: `${__basedir}/../public/crop-${data.type_id}`,
      filename: `fields.pdf`
    })

    return await ApprovalRegisterSigns.create({
      approval_register_id: data.register_id,
      hash,
      ots: await Stamp.stampHash(hash),
      meta: JSON.stringify({ path }),
      user_id: auth.user.id
    })

    return register
  }
}

module.exports = ApprovalsRegisterController