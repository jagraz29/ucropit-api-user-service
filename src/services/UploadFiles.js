function filterFile(req, file, cp) {
  const fileType = file.originalname.split('.').pop()
  if (file.fieldname === 'image') {
    switch (fileType) {
      case 'jpg':
        cp(null, true)
        break
      case 'png':
        cp(null, true)
        break
      default:
        cp(null, false)
        break
    }
  } else {
    switch (fileType) {
      case 'pdf':
        cp(null, true)
        break
      case 'docx':
        cp(null, true)
        break
      case 'doc':
        cp(null, true)
        break
      default:
        cp(null, false)
        break
    }
  }
  cp(null, false)
}
module.exports = filterFile