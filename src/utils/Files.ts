const mkdirp = require('mkdirp')
import { join } from 'path'

import * as fs from 'fs'

export const VALID_FORMATS_FILES = `text.*|image.*|application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/octet-stream|application/vnd.google-earth.kmz|application/vnd.google-earth.kml`
export const VALID_FORMATS_DOCUMENTS = `text.*|image.*|application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document`
export const DIR_FOLDER_DEFAULT_IMAGES = 'public/uploads/default-images'

export async function makeDirIfNotExists (dir) {
  await mkdirp(dir)
  return dir
}

export function getFullPath (filePath: string) {
  return join(publicPath(), filePath)
}

function publicPath () {
  return join(basePath(), `public`)
}

export function basePath (): string {
  return join(__dirname, '../../../')
}

export function removeFile (dir: string) {
  fs.unlinkSync(dir)
}

export function saveFile (path: string,pdfBytes: string) {
  fs.writeFileSync(`${basePath()}${path}`, pdfBytes)
}

export function readFile (path: string) {
  if (fileExist(path)) {
    return fs.readFileSync(`${basePath()}${path}`, { encoding: 'utf-8' })
  }
  return null
}
export function readFileBuffer (path: string) {
  if (fileExist(path)) {
    return fs.readFileSync(`${basePath()}${path}`)
  }
  return null
}

export async function removeFiles (dirs: Array<string>): Promise<boolean> {
  for (const path of dirs) {
    if (fileExist(path)) {
      removeFile(path)
    }
  }

  return true
}

export function getPathFileByType (type): string {
  let dir = ''
  switch (type) {
    case 'company':
      dir = `${process.env.DIR_UPLOADS}/${process.env.DIR_FILES_COMPANY}`
      break
    case 'activity':
      dir = `${process.env.DIR_UPLOADS}/${process.env.DIR_FILES_ACTIVITIES}`
  }

  return dir
}

export function fileExist (dir: string) {
  if (fs.existsSync(dir)) {
    return true
  }
  return false
}
