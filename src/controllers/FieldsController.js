'use strict'

const Field = require('../models').fields
const Lot = require('../models').lots
const UploadFile = require('../services/UploadFiles')
const GoogleGeoCoding = require('../services/GoogleGeoCoding')
const CropType = require('../models').crop_types
const FieldService = require('../services/fields/FieldService')
const {
  handleFileConvertJSON,
  kmlJsonToArrayNames,
} = require('../services/ParseFileKml')

class FieldsController {
  static async index(auth) {
    try {
      return await Field.findAll({
        where: { user_id: auth.user.id },
        include: [{ model: Lot }],
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  static async indexAll() {
    try {
      return await Field.findAll()
    } catch (err) {
      throw new Error(err)
    }
  }

  static async show(id) {
    try {
      return await Field.findOne({
        where: { id: id },
        include: [
          {
            model: Lot,
            include: [
              {
                model: CropType,
                attributes: ['id', ['name', 'label'], ['id', 'value']],
              },
            ],
          },
        ],
      })
    } catch (err) {
      throw new Error(err)
    }
  }

  static async create(data, auth, file) {
    try {
      const result = await FieldService.createField(data, auth, file)

      if (result.error)
        return { error: result.error, message: 'Error al crear el campo' }

      if (data.lots) {
        const resultLots = await FieldService.createLots(
          data.lots,
          file,
          result.field,
          data.crop_type_id
        )

        if (resultLots.error)
          return {
            error: result.error,
            message: 'Error al crear lotes',
          }
      }

      return result
    } catch (err) {
      throw new Error(err)
    }
  }

  static async update(id, data, file) {
    try {
      const field = await Field.findOne({
        where: { id: id },
      })

      const resultGeocode = await GoogleGeoCoding.getGeocoding(
        data.lat,
        data.lng
      )

      const values = {
        ...data,
        address: !resultGeocode.error
          ? resultGeocode.data[1].formatted_address
          : null,
      }

      if (file) {
        const upload = new UploadFile(file, 'uploads')
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
        where: { id: id },
      })

      return await crop.destroy()
    } catch (err) {
      throw new Error(err)
    }
  }

  static async parseFile(file) {
    try {
      const formatJson = await handleFileConvertJSON(file)

      return kmlJsonToArrayNames(formatJson)
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

module.exports = FieldsController
