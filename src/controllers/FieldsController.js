"use strict";

const Field = require("../models").fields;

class FieldsController {
  static async index() {
    try {
      return await Field.findAll()
    } catch (err) {
      console.log(err)
    }
  }

  static async show(id) {
    try {
      return await Field.findOne({
        where: { id: id }
      })
    } catch (err) {
      console.log(err)
    }
  }

  static async create(data) {
    try {
      return await Field.create(data)
    } catch (err) {
      console.log(err)
    }
  }

  static async update(id, data) {
    try {
      const crop = await Field.findOne({
        where: { id: id }
      })

      return await crop.update(data)
    } catch (err) {
      console.log(err)
    }
  }


  static async delete(id) {
    try {
      const crop = await Field.findOne({
        where: { id: id }
      })

      return await crop.destroy()
    } catch(err) {
      console.log(err)
    }
  }
}

module.exports = FieldsController

