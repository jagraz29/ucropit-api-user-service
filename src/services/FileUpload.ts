const heicConvert = require('heic-convert')
import { UploadedFile } from 'express-fileupload'
import { writeFileSync, mkdirSync } from 'fs'
import { getFullPath, VALID_FORMATS_FILES } from '../utils/Files'

class FileUpload {
  private files
  private destination: string

  constructor(files, destination: string) {
    this.files = files
    this.destination = destination
  }

  public async store(): Promise<any> {
    if (Object.keys(this.files).length === 0) {
      throw new Error('No files were uploaded.')
    }

    const movePromises = Object.keys(this.files).map(
      (key) =>
        new Promise(async (res, rej) => {
          try {
            if (this.files[key].length > 0) {
              let filesStored = this.files[key].map(async (file) => {
                const result = await this.save(file)
                return result
              })

              filesStored = await Promise.all(filesStored)
              res(filesStored)
            }

            const fileStored = await this.save(this.files[key])
            res(fileStored)
          } catch (error) {
            return rej(error)
          }
        })
    )

    const result = await Promise.all(movePromises)

    return Array.isArray(result[0]) ? result[0] : result
  }

  async save(file: UploadedFile) {
    if (!this.validTypes(file)) {
      throw new Error('File extension is rejected')
    }

    const fileNameArray = file.name.trim().split('.')

    const renameFile = `${file.md5}.${fileNameArray.pop()}`

    const path = getFullPath(`${process.env.DIR_UPLOADS}/${this.destination}`)
    return new Promise(async (resolve, reject) => {
      if (file.mimetype === 'image/heic') {
        return resolve(this.convertAndSaveNewFile(file, path))
      }

      file.mv(`${path}/${renameFile}`, (err) => {
        if (err) reject(err)

        resolve({
          path: `${process.env.DIR_UPLOADS}/${this.destination}/${renameFile}`,
          nameFile: renameFile,
          fileType: file.mimetype
        })
      })
    })
  }

  validTypes(file) {
    return file.mimetype.match(VALID_FORMATS_FILES) !== null
  }

  async convertImageHeciToJpeg(inputBuffer) {
    const outputBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1
    })
    return outputBuffer
  }

  async convertAndSaveNewFile(file, path) {
    mkdirSync(path)
    const renameFile = `${file.md5}.jpg`
    const outputBuffer = await this.convertImageHeciToJpeg(file.data)
    writeFileSync(`${path}/${renameFile}`, outputBuffer)
    return {
      path: `${process.env.DIR_UPLOADS}/${this.destination}/${renameFile}`,
      nameFile: renameFile,
      fileType: 'image/jpeg'
    }
  }
}

export default FileUpload
