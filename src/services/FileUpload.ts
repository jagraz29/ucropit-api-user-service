import { UploadedFile } from 'express-fileupload'
import path from 'path'
import { getFullPath, makeDirIfNotExists } from '../utils/Files'

interface IStore {
  path: string
  nameFile: string
  fileType: string
}

const VALID_FORMATS_FILES = `text.*|image.*|application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/octet-stream|application/vnd.google-earth.kmz|application/vnd.google-earth.kml`

class FileUpload {
  private files
  private destination: string

  constructor (files, destination: string) {
    this.files = files
    this.destination = destination
  }

  public async save (): Promise<Array<IStore>> {
    if (this.files.documents) {
      return this.storeMultiple()
    }

    return this.store()
  }

  public async storeMultiple () {
    const filesStore = []

    if (!this.files.documents) {
      throw new Error(
        'For multiple file, expect documents attribute in obejct'
      )
    }

    if (this.files.documents === 0) {
      throw new Error('No files were uploaded.')
    }

    // If documents is object, cast to array
    if (!this.files.documents.length) {
      this.files.documents = [this.files.documents]
    }

    if (
      this.files.documents.filter((file) => !this.validTypes(file)).length > 0
    ) {
      throw new Error('File extension is rejected')
    }

    for (const file of this.files.documents) {
      const fileNameArray = file.name.trim().split('.')

      const renameFile = `${file.md5}.${fileNameArray.pop()}`

      const path = await makeDirIfNotExists(getFullPath(`${this.destination}`))

      await file.mv(`${path}/${renameFile}`)

      filesStore.push({
        path: `/${process.env.DIR_UPLOADS}/${this.destination}/${renameFile}`,
        nameFile: renameFile,
        fileType: file.mimetype
      })
    }

    return filesStore
  }

  public async store (): Promise<Array<IStore>> {
    if (Object.keys(this.files).length === 0) {
      throw new Error('No files were uploaded.')
    }

    if (!this.validTypes(this.files.files)) {
      throw new Error('File extension is rejected')
    }

    // Check this line
    const toUploadFile: UploadedFile = this.files.files

    const fileNameArray = toUploadFile.name.trim().split('.')

    const renameFile = `${toUploadFile.md5}.${fileNameArray.pop()}`

    const path = await makeDirIfNotExists(getFullPath(`${process.env.DIR_UPLOADS}/${this.destination}`))

    return new Promise((resolve, reject) => {
      toUploadFile.mv(`${path}/${renameFile}`, (err) => {
        if (err) reject(new Error("File's extension is rejected"))

        resolve([
          {
            path: `${process.env.DIR_UPLOADS}/${this.destination}/${renameFile}`,
            nameFile: renameFile,
            fileType: toUploadFile.mimetype
          }
        ])
      })
    })
  }

  validTypes (file) {
    return file.mimetype.match(VALID_FORMATS_FILES) !== null
  }
}

export default FileUpload
