const express = require('express')
const router = express.Router()
const UploadController = require('../controllers/UploadController')
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({
  storage: storage,
  fileFilter: require('../services/UploadFiles')
})

router.post('/images', upload.single('image'), (req, res) => {
  const typeFile = req.file !== undefined ? req.file.originalname.split('.').pop() : 0
  switch (typeFile) {
    case 'jpg':
      UploadController.upload(req.file)
      res.send('Subido Correctamente')
      break
    case 'png':
      UploadController.upload(req.file)
      res.send('Subido Correctamente')
      break
    default:
      res.send('Archivo invalido, Debe ser una imagen')
      break
  }
})
router.post('/file', upload.single('file'), (req, res) => {
  const typeFile = req.file !== undefined ? req.file.originalname.split('.').pop() : 0
  switch (fileType) {
    case 'pdf':
      UploadController.upload(req.file)
      res.send('Archivo Subido Correctamente')
      break
    case 'docx':
      UploadController.upload(req.file)
      res.send('Archivo Subido Correctamente')
      break
    case 'doc':
      UploadController.upload(req.file)
      res.send('Archivo Subido Correctamente')
      break
    default:
      res.send('Archivo Invalido, Debe ser un Documento Word o Pdf')
      break
  }
})
module.exports = router