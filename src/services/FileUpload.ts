import { FileArray, UploadedFile } from 'express-fileupload'
import path from 'path'
import { getFullPath, makeDirIfNotExists } from '../utils/Files'

interface IStore {
  path: string
  namefile: string
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

  public async store (): Promise<IStore> {
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

    await makeDirIfNotExists(getFullPath(`${this.destination}`))

    return new Promise((resolve, reject) => {
      toUploadFile.mv(
        path.join(
          process.cwd(),
          `/${process.env.DIR_STORAGE}/${this.destination}/${renameFile}`
        ),
        err => {
          console.log(err)
          if (err) reject(new Error("File's extension is rejected"))

          resolve({
            path: `${process.env.BASE_URL}/${this.destination}/${renameFile}`,
            namefile: renameFile,
            fileType: toUploadFile.mimetype
          })
        }
      )
    })
  }

  validTypes (file) {
    return file.mimetype.match(VALID_FORMATS_FILES) !== null
  }
}

export default FileUpload
