const path = require("path");

class UploadFiles {
  constructor(files, destination) {
    this.files = files;
    this.destination = destination;
  }

  store() {
    if (Object.keys(this.files).length == 0) {
      throw new Error("No files were uploaded.");
    }

    if (!this.validTypes(this.files.file))
      throw new Error("File's extension is rejected");

    let sampleFile = this.files.file;
    return new Promise((resolve, reject) => {
      sampleFile.mv(
        path.join(
          __dirname,
          `../../public/${this.destination}/${sampleFile.name}`
        ),
        err => {
          if (err) reject(new Error("File's extension is rejected"));

          resolve({
            path: `${process.env.BASE_URL}/${this.destination}/${
              sampleFile.name
            }`
          });
        }
      );
    });
  }

  validTypes(file) {
    const fileTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = fileTypes.test(path.extname(file.name).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = UploadFiles;
