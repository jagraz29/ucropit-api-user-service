"use strict";

const Crop = require("../models").crops;

class CropsController {
  static async index() {
    try {
      return await Crop.findAll()
    } catch (err) {
      console.log(err)
    }
  }

  static async show(id) {
    try {
      return await Crop.findOne({
        where: { id: id }
      })
    } catch (err) {
      console.log(err)
    }
  }

  static async create(data) {
    try {
      return await Crop.create(data)
    } catch (err) {
      console.log(err)
    }
  }

  static async update(id, data) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      })

      return await crop.update(data)
    } catch (err) {
      console.log(err)
    }
  }


  static async delete(id) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      })

      return await crop.destroy()
    } catch(err) {
      console.log(err)
    }
  }
}

module.exports = CropsController

