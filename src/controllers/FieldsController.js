"use strict";

const Field = require("../models").fields
const Lot = require("../models").lots
const UploadFile = require("../services/UploadFiles")

class FieldsController {
  static async index(auth) {
    try {
      return await Field.findAll({
        where: { user_id: auth.user.id },
        include: [{ model: Lot }]
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  static async show(id) {
    try {
      return await Field.findOne({
        where: { id: id },
        include: [{ model: Lot }]
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  static async create(data, auth, file) {
    try {
      const values = {
        ...data,
        user_id: auth.user.id
      }

      if (file) {
        const upload = new UploadFile(file, "uploads")
        const res = await upload.store()
        values.kmz_path = res.namefile
      }

      return await Field.create(values)
    } catch (err) {
      throw new Error(err)
    }
  }

  static async update(id, data, file) {
    try {
      const field = await Field.findOne({
        where: { id: id }
      })

      const values = {
        ...data
      }

      if (file) {
        const upload = new UploadFile(file, "uploads")
        const res = await upload.store()
        values.kmz_path = res.namefile
      }

      return await field.update(values)
    } catch (err) {
      throw new Error(err)
    }
  }

  static async delete(id) {
    try {
      const crop = await Field.findOne({
        where: { id: id }
      })

      return await crop.destroy()
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = FieldsController

