import { FileArray } from 'express-fileupload'
import parseKMZ from 'parse-kmz'
import parseKML from 'parse-kml'
import * as geolib from 'geolib'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'

import FileUpload from '../services/FileUpload'

/**
 * File convert KMZ or KML to JSON.
 *
 * @param file
 */
export const handleFileConvertJSON = async function (file: FileArray) {
  let result = null

  const upload = new FileUpload(file, 'tmp')
  const stored = await upload.store()

  const pathFile = path.join(
    process.cwd(),
    `/${process.env.DIR_TMP}/${stored.namefile}`
  )

  if (stored.namefile.split('.')[1] === 'kmz') {
    result = await parseKMZ.toJson(pathFile)
  } else result = await parseKML.toJson(pathFile)

  fs.unlinkSync(pathFile)

  return result
}

/**
 * Convert content file kmz to JSON.
 *
 * @param {*} path
 *
 * @return {Object}
 */
export const parseKmzToJson = async function (path) {
  const result = await parseKMZ.toJson(path)

  fs.unlinkSync(path)

  return result
}

/**
 * Convert content file kml to JSON.
 *
 * @param {*} path
 *
 * @return {Object}
 */
export const parseKmlToJson = async function (path) {
  const result = await parseKML.toJson(path)

  fs.unlinkSync(path)

  return result
}

/**
 * Format list lots name into Array.
 *
 * @param {*} data
 *
 * @return {Array}
 */
export const kmlJsonToArrayNames = function (data) {
  const lotsNames = data.features.map((item) => {
    return item.properties.name
  })

  return lotsNames
}

/**
 * Convert Array Objects, include name surface and area of lot.
 *
 * @param kmzJsonParsers
 */
export const mapArraySurfacesAndArea = function (kmzJsonParsers) {
  return kmzJsonParsers.features.map((lot) => {
    const flattenArr = _.flatten(lot.geometry.coordinates)
    const areaSquare = geolib.getAreaOfPolygon(flattenArr)
    const surface = geolib.convertArea(areaSquare, 'ha').toFixed(2)
    return {
      name: lot.properties.name,
      surface: surface,
      area: areaSquare
    }
  })
}
