import { UploadedFile } from 'express-fileupload'
import path from 'path'

interface IStore {
  path: string
  namefile: string
  fileType: string
}

class FileUpload {
  files: UploadedFile[]
  destination: string

  constructor (files: UploadedFile[], destination: string) {
    this.files = files
    this.destination = destination
  }

  store (): Promise<IStore> {
    if (Object.keys(this.files).length === 0) {
      throw new Error('No files were uploaded.')
    }

    if (!this.validTypes(this.files[0])) {
      throw new Error('File extension is rejected')
    }
    const sampleFile: UploadedFile = this.files[0]

    const fileNameArray = sampleFile.name.trim().split('.')

    const renameFile = `${sampleFile.md5}.${fileNameArray.pop()}`

    return new Promise((resolve, reject) => {
      sampleFile.mv(
        path.join(process.cwd(), `/public/${this.destination}/${renameFile}`),
        (err) => {
          console.log(err)
          if (err) reject(new Error("File's extension is rejected"))

          resolve({
            path: `${process.env.BASE_URL}/${this.destination}/${renameFile}`,
            namefile: renameFile,
            fileType: sampleFile.mimetype
          })
        }
      )
    })
  }

  validTypes (file) {
    return (
      file.mimetype.match(
        'text.*|image.*|application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/octet-stream|application/vnd.google-earth.kmz|application/vnd.google-earth.kml'
      ) !== null
    )
  }
}

export default FileUpload
