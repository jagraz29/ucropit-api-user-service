"use strict";

const Crop = require("../models").crops;
const CropTypes = require("../models").crop_types;
const Fields = require("../models").fields;

class CropsController {
  static async index() {
    try {
      return await Crop.findAll({ include: [{ model: CropTypes }, { model: Fields }] })
    } catch (err) {
      throw new Error(err)
    }
  }

  static async types() {
    try {
      return await CropTypes.findAll()
    } catch (err) {
      throw new Error(err)
    }
  }

  static async show(id) {
    try {
      return await Crop.findOne({
        where: { id: id },
        include: [{ model: CropTypes }, { model: Fields }]
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  static async create(data) {
    try {
      return await Crop.create({
        ...data,
        budget: JSON.stringify({
          items: [
            { id: 1, name: 'Campo', data: {}, status: 0, form: 'fields' },
            { id: 2, name: 'Pre-Siembra', data: {}, status: 0, form: 'pre-sowing' },
            { id: 3, name: 'Siembra', data: {}, status: 0, form: 'sowing'},
            { id: 4, name: 'Protección de Cultivos', data: {}, status: 0, form: 'protection' },
            { id: 5, name: 'Cosecha y Comercialización', data: {}, status: 0, form: 'harvest-and-marketing' },
            { id: 6, name: 'Gastos administrativos', data: {}, status: 0, form: 'other-expenses' },
          ]
        })
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  static async update(id, data) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      })

      return await crop.update(data)
    } catch (err) {
      throw new Error(err)
    }
  }


  static async delete(id) {
    try {
      const crop = await Crop.findOne({
        where: { id: id }
      })

      return await crop.destroy()
    } catch (err) {
      throw new Error(err)
    }
  }
}

module.exports = CropsController

