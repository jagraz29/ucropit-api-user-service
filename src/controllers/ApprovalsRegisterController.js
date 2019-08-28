'use strict'

const PDF = require('../services/PDF')
const Stamp = require('../services/Stamp')
const Approvals = require('../models').approval
const ApprovalRegister = require('../models').approval_register
const ApprovalRegisterSigns = require('../models').approval_register_sign
const ApprovalRegisterFiles = require('../models').approval_register_file
const UploadFile = require("../services/UploadFiles");

class ApprovalsRegisterController {
  static async create(id) {
    return await ApprovalRegister.create({
      approval_id: id
    })
  }

  static async show(crop, stage, type, typeId) {
    const approval = stage === 'fields'
      ? await Approvals.findOne({ where: { stage: stage, crop_id: crop } })
      : await Approvals.findOne({
        where: {
          stage: stage,
          crop_id: crop,
          service_id: type === 'service' ? typeId : null,
          input_id: type === 'input' ? typeId : null,
        }
      })

    const register = ApprovalRegister.findOne({
      where: { approval_id: approval.id },
      include: [
        { model: ApprovalRegisterSigns, as: 'Signs' },
        { model: ApprovalRegisterFiles, as: 'Files' }
      ]
    })

    return register
  }

  static async showRegister(id) {
    const register = ApprovalRegister.findOne({
      where: { id },
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

    const Register = await ApprovalRegister.findOne({
      where: { id: data.register_id }
    })

    await Register.update({ data: JSON.stringify(data.meta) })

    return await ApprovalRegisterSigns.create({
      approval_register_id: data.register_id,
      hash,
      ots: await Stamp.stampHash(hash),
      meta: JSON.stringify({ path }),
      user_id: auth.user.id
    })

    return register
  }

  static async file(id, file, concept) {
    const upload = new UploadFile(file, "uploads");
    const res = await upload.store()

    await ApprovalRegisterSigns.destroy({ where: { approval_register_id: id } })

    return await ApprovalRegisterFiles.create({
      approval_register_id: id,
      concept,
      path: res.namefile,
      type: res.fileType
    })
  }
}

module.exports = ApprovalsRegisterController