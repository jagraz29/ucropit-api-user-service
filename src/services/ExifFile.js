const exif = require('exif-parser');
const fs = require('fs');

class ExifFile {
  constructor(pathFile) {
    this.pathFile = pathFile;
  }

  get metadata() {
    if (!this.pathFile) throw new Error('Path file must set.');

    const buffer = fs.readFileSync(this.pathFile);
    const parser = exif.create(buffer);
    const result = parser.parse();

    return result;
  }
}

module.exports = ExifFile;
