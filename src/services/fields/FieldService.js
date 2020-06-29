/* global logger */
'use strict'

const Lot = require('../../models').lots
const Field = require('../../models').fields
const UploadFile = require('../UploadFiles')
const GoogleGeoCoding = require('../GoogleGeoCoding')
const { handleFileConvertJSON } = require('../ParseFileKml')

const _ = require('lodash')
const geolib = require('geolib')

class FieldService {
  /**
   * Get address for way latitude and longitude.
   * 
   * @param {Object} {lat, lng}
   */
  static async getGeocoding({ lat, lng }) {
    try {
      return await GoogleGeoCoding.getGeocoding(lat, lng)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  /**
   * Create a field.
   * 
   * @param {*} data 
   * @param {*} auth 
   * @param {*} file 
   * 
   * @return {Object}
   */
  static async createField(data, auth, file) {
    try {
      const resultGeocode = await this.getGeocoding({
        lat: data.lat,
        lng: data.lng,
      })

      if (!resultGeocode) return { error: true }

      const values = {
        ...data,
        user_id: auth.user.id,
        address: !resultGeocode.error
          ? resultGeocode.data[1].formatted_address
          : null,
      }

      if (file) {
        const upload = new UploadFile(file, 'uploads')
        const res = await upload.store()
        values.kmz_path = res.namefile
      }

      const field = await Field.create(values)

      return { error: false, field }
    } catch (error) {
      logger.log({
        level: 'error',
        message: error.message,
        metadata: {
          name_class: 'Field Service',
          method: 'createField',
        },
        Date: new Date(),
      })

      return { error: true }
    }
  }

  /**
   * Create lots by name of lots, calculate surface and area 
   * return list lots created.
   * 
   * @param {*} nameLots 
   * @param {*} file 
   * @param {*} field 
   * @param {*} cropTypeId 
   */
  static async createLots(nameLots, file, field, cropTypeId) {
    const resultAsync = []
    try {
      const jsonParserKmz = await handleFileConvertJSON(file)

      const filteringItem = jsonParserKmz.features.filter((item) => {
        return (
          nameLots.filter((name) => name === item.properties.name).length > 0
        )
      })

      const upload = new UploadFile(file, 'uploads')
      const res = await upload.store()

      const lotsToCreate = filteringItem.map((lot) => {
        const flattenArr = _.flatten(lot.geometry.coordinates)
        const areaSquare = geolib.getAreaOfPolygon(flattenArr)
        const surface = geolib.convertArea(areaSquare, 'ha').toFixed(2)
        return {
          name: lot.properties.name,
          surface: surface,
          kmz_path: res.namefile,
          crop_type_id: parseInt(cropTypeId),
          field_id: field.id,
          area: areaSquare,
        }
      })

      for (const lot of lotsToCreate) {
        const lotSync = Lot.create(lot)
        resultAsync.push(lotSync)
      }

      return await Promise.all(resultAsync)
    } catch (error) {
      logger.log({
        level: 'error',
        message: error.message,
        metadata: {
          name_class: 'Field Service',
          method: 'createLots',
        },
        Date: new Date(),
      })
      return {error: true}
    }
  }
}

module.exports = FieldService
