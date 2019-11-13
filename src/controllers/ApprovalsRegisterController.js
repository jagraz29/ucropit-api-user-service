"use strict";

const PDF = require("../services/PDF");
const Stamp = require("../services/Stamp");
const User = require("../models").users;
const Approvals = require("../models").approval;
const ApprovalRegister = require("../models").approval_register;
const ApprovalRegisterSigns = require("../models").approval_register_sign;
const ApprovalRegisterFiles = require("../models").approval_register_file;
const ProductionStages = require("../models").production_stage;
const Production = require("../models").productions;
const UploadFile = require("../services/UploadFiles");
const ExifFile = require("../services/ExifFile");
const Sequelize = require("sequelize");
const path = require("path");

const Op = Sequelize.Op;

class ApprovalsRegisterController {
  static async complete(id) {
    const register = await Approvals.findOne({ where: { id } });
    const type_id = register.service_id || register.input_id;

    const production = await Production.findOne({
      where: { crop_id: register.crop_id },
      include: [
        {
          model: ProductionStages,
          as: "Stage",
          where: { label: register.stage }
        }
      ]
    });

    const stage = production.get({ plain: true }).Stage[0];
    const data = JSON.parse(stage.data).map(el => {
      if (el.field_id == type_id) {
        el.status = "done";
      }
      return el;
    });

    const prodStage = await ProductionStages.findOne({
      where: { id: stage.id }
    });

    await prodStage.update({ data: JSON.stringify(data) });

    return prodStage;
  }

  static async create(id) {
    return await ApprovalRegister.create({
      approval_id: id
    });
  }

  static async show(crop, stage, type, typeId) {
    const approval =
      stage === "fields"
        ? await Approvals.findOne({ where: { stage: stage, crop_id: crop } })
        : await Approvals.findOne({
            where: {
              stage: stage,
              crop_id: crop,
              service_id: type === "service" ? typeId : null,
              input_id: type === "input" ? typeId : null
            }
          });

    const register = ApprovalRegister.findOne({
      where: { approval_id: approval.id },
      include: [
        { model: ApprovalRegisterSigns, as: "Signs" },
        { model: ApprovalRegisterFiles, as: "Files" }
      ]
    });

    return register;
  }

  static async showRegister(id) {
    const register = ApprovalRegister.findOne({
      where: { id },
      include: [
        { model: ApprovalRegisterSigns, as: "Signs" },
        {
          model: ApprovalRegisterFiles,
          as: "Files",
          include: [{ model: User }]
        }
      ]
    });

    return register;
  }

  static async sign(data, crop, stage, auth) {
    const { hash, path } = await PDF.generate({
      data: {
        time: new Date()
      },
      template: "templates/sign-receipt.pug",
      path: `${__basedir}/../public/crop-${data.type_id}`,
      filename: `fields.pdf`
    });

    const Register = await ApprovalRegister.findOne({
      where: { id: data.register_id }
    });

    const register = await Register.update({ data: JSON.stringify(data.meta) });

    await ApprovalRegisterSigns.create({
      approval_register_id: data.register_id,
      hash,
      ots: await Stamp.stampHash(hash),
      meta: JSON.stringify({ path }),
      user_id: auth.user.id
    });

    return register;
  }

  static async showFiles(idRegisterApproval) {
    const files = await ApprovalRegisterFiles.findAll({
      include: [{ model: User }],
      where: {
        approval_register_id: idRegisterApproval
      }
    });

    return files;
  }

  static async file(id, file, concept, auth, position = null) {
    try {
      const upload = new UploadFile(file, "uploads");
      const res = await upload.store();

      await ApprovalRegisterSigns.destroy({
        where: { approval_register_id: id }
      });

      if (res.fileType !== "image/jpeg") {
        return await ApprovalRegisterFiles.create({
          approval_register_id: id,
          concept,
          path: res.namefile,
          type: res.fileType
        });
      }

      const exif = new ExifFile(
        path.join(__dirname, `../../public/uploads/${res.namefile}`)
      );

      return await ApprovalRegisterFiles.create({
        approval_register_id: id,
        concept,
        path: res.namefile,
        type: res.fileType,
        latitude: exif.metadata.tags.GPSLatitude || position.latitude,
        longitude: exif.metadata.tags.GPSLongitude || position.longitude,
        user_id: auth.user.id
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = ApprovalsRegisterController;
