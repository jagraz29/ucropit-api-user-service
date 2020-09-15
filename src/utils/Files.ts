const mkdirp = require('mkdirp')
import { join } from 'path'

import * as fs from 'fs'

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
