'use strict'
const UploadFile = require('./UploadFiles')
const parseKMZ = require('parse-kmz')
const parseKML = require('parse-kml')
const path = require('path')
const fs = require('fs')

/**
 * Handle kmz or kml file and convert to JSON.
 * 
 * @param {*} file
 * 
 * @returns {Object}
 * 
 */
const handleFileConvertJSON = async file => {
  let result = null
  const upload = new UploadFile(file, 'tmp')
  const stored = await upload.store()

  const pathFile = path.join(__dirname, `../../public/tmp/${stored.namefile}`)
  
  if(stored.namefile.split('.')[1] === 'kmz')
    result = await parseKMZ.toJson(pathFile)
  else
    result = await parseKML.toJson(pathFile)

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
const parseKmzToJson = async (path) => {
  const result =  await parseKMZ.toJson(path)

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
const parseKmlToJson = async (path) => {
  const result =  await parseKML.toJson(path)

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
const kmlJsonToArrayNames = (data) => {
  const lotsNames = data.features.map(item => {
    return item.properties.name
  })

  return lotsNames
}

module.exports = {
  kmlJsonToArrayNames,
  handleFileConvertJSON,
  parseKmzToJson,
  parseKmlToJson
}