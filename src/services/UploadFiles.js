const path = require('path')

class UploadFiles {
  constructor(files, destination) {
    this.files = files
    this.destination = destination
  }

  store() {
    if (Object.keys(this.files).length == 0) {
      throw new Error('No files were uploaded.')
    }

    if (!this.validTypes(this.files.file)) {
      throw new Error('File\'s extension is rejected')
    }

    //Ranem filename for md5 name file.

    let sampleFile = this.files.file
    const fileNameArray = sampleFile.name.split('.')

    const renameFile = `${sampleFile.md5}.${fileNameArray[1]}`

    return new Promise((resolve, reject) => {
      sampleFile.mv(
        path.join(__dirname, `../../public/${this.destination}/${renameFile}`),
        err => {
          if (err) reject(new Error(err, 'File\'s extension is rejected'))

          resolve({
            path: `${process.env.BASE_URL}/${this.destination}/${renameFile}`,
            namefile: renameFile,
            fileType: sampleFile.mimetype
          })
        }
      )
    })
  }

  validTypes(file) {
    return file.mimetype.match('text.*|image.*|application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document|application/octet-stream|application/vnd.google-earth.kmz') !== null
  }
}

module.exports = UploadFiles
