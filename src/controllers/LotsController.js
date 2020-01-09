'use strict'

const Lot = require('../models').lots
const UploadFile = require('../services/UploadFiles')

class LotsController {
  static async index () {
    try {
      return await Lot.findAll()
    } catch (err) {
      console.log(err)
    }
  }

  static async byField (id) {
    try {
      return await Lot.findAll({
        where: {
          field_id: id
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  static async show (id) {
    try {
      return await Lot.findOne({
        where: { id: id }
      })
    } catch (err) {
      console.log(err)
    }
  }

  static async create (data, file) {
    try {
      if (file) {
        const upload = new UploadFile(file, 'uploads')
        const res = await upload.store()
        data.kmz_path = res.namefile
      }

      return await Lot.create(data)
    } catch (err) {
      console.log(err)
    }
  }

  static async update (id, data, file) {
    try {
      const crop = await Lot.findOne({
        where: { id: id }
      })

      if (file) {
        const upload = new UploadFile(file, 'uploads')
        const res = await upload.store()
        data.kmz_path = res.namefile
      }

      return await crop.update(data)
    } catch (err) {
      console.log(err)
    }
  }

  static async delete (id) {
    try {
      const crop = await Lot.findOne({
        where: { id: id }
      })

      return await crop.destroy()
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = LotsController
