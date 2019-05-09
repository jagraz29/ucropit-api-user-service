"use strict";

const Field = require("../models").fields;
const Lot = require("../models").lots;

class FieldsController {
  static async index() {
    try {
      return await Field.findAll({
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

  static async create(data) {
    try {
      return await Field.create(data)
    } catch (err) {
      throw new Error(err)
    }
  }

  static async update(id, data) {
    try {
      const crop = await Field.findOne({
        where: { id: id }
      })

      return await crop.update(data)
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

