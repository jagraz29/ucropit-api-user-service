const fs = require('fs')
const path = require('path')

const getShortYear = function (date) {
  return new Date(date)
    .getFullYear()
    .toString()
    .substr(-2)
}

const paginate = (query, { page, pageSize }) => {
  const offset = parseInt(page) * parseInt(pageSize)
  const limit = parseInt(pageSize)
  return {
    ...query,
    offset,
    limit
  }
}

/**
 * Create if dont exists path
 * @param {*} directoryPath
 */
function mkdirpath (directoryPath) {
  const directory = path.normalize(directoryPath)

  return new Promise((resolve, reject) => {
    fs.stat(directory, error => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.mkdir(directory, { recursive: true }, error => {
            if (error) {
              reject(error)
            } else {
              resolve(directory)
            }
          })
        } else {
          reject(error)
        }
      } else {
        resolve(directory)
      }
    })
  })
}

/**
 * Transform a byteArray file to hex representation
 *
 * @param {*} byteArray
 */
function toHexString (byteArray) {
  return Array.from(byteArray, byte => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2)
  }).join('')
}

function stagesName (stage) {
  const stages = {
    fields: 'Campo',
    'pre-sowing': 'Pre-Siembra',
    sowing: 'Siembra',
    protection: 'Protección de cultivo',
    'other-expenses': 'Gastos administrativos'
  }

  return stages[stage] || ''
}

module.exports = { getShortYear, paginate, mkdirpath, toHexString, stagesName }
