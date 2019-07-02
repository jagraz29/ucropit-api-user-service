"use strict";

const Lot = require("../models").lots;

class LotsController {
  static async index() {
    try {
      return await Lot.findAll()
    } catch (err) {
      console.log(err)
    }
  }

  static async show(id) {
    try {
      return await Lot.findOne({
        where: { id: id }
      })
    } catch (err) {
      console.log(err)
    } 
  }

  static async create(data) {
    try {
      return await Lot.create(data)
    } catch (err) {
      console.log(err)
    }
  }

  static async update(id, data) {
    try {
      const crop = await Lot.findOne({
        where: { id: id }
      })

      return await crop.update(data)
    } catch (err) {
      console.log(err)
    }
  }


  static async delete(id) {
    try {
      const crop = await Lot.findOne({
        where: { id: id }
      })

      return await crop.destroy()
    } catch(err) {
      console.log(err)
    }
  }
}

module.exports = LotsController

