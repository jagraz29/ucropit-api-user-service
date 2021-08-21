import { FileArray } from 'express-fileupload'
import parseKMZ from 'parse-kmz'
import parseKML from 'parse-kml'
import * as geolib from 'geolib'
import * as turf from '@turf/turf'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'

import FileUpload from '../services/FileUpload'
import { removeFiles } from '../utils/Files'
import { Numbers } from '../utils/Numbers'

const CONVERSION_SURFACE_FACTOR = 10000

/**
 * File convert KMZ or KML to JSON.
 *
 * @param file
 */
export const handleFileConvertJSON = async function (file: FileArray) {
  const lots = []
  const paths = []
  let result = null

  const upload = new FileUpload(file, 'tmp')
  const stored = await upload.store()

  for (const fileStore of stored) {
    const pathFile = path.join(
      process.cwd(),
      `${process.env.DIR_TMP}/${fileStore.nameFile}`
    )

    if (fileStore.nameFile.split('.')[1] === 'kmz') {
      result = await parseKMZ.toJson(pathFile)
    } else {
      result = await parseKML.toJson(pathFile)
    }

    lots.push(result)
    paths.push(pathFile)
  }

  await removeFiles(paths)

  return Promise.all(lots)
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
  const listLots = kmzJsonParsers.map((item) => {
    return item.features.map((lot) => {
      const areaSquare = turf.area(lot.geometry)
      const surface = Numbers.roundToTwo(areaSquare / CONVERSION_SURFACE_FACTOR)

      return {
        name: lot.properties.name,
        surface: surface,
        area: areaSquare
      }
    })
  })

  return _.flatten(listLots)
}
