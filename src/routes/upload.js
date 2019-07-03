const express = require("express");
const router = express.Router();
const multer = require("multer");
const UploadController = require("../controllers/UploadController");
const { validTypes } = require("../services/UploadFiles");

const uploadImage = multer({
  storage: globalStorage,
  fileFilter: function(req, file, cb) {
    validTypes(req, file, cb, "images");
  }
});

const uploadFiles = multer({
  storage: globalStorage,
  fileFilter: function(req, file, cb) {
    validTypes(req, file, cb, "files");
  }
});

router.post("/image", uploadImage.single("image"), (req, res) => {
  if (req.fileValidationError) {
    return res
      .status(400)
      .json({ code: 400, error: true, message: req.fileValidationError });
  }

  UploadController.create(req.file)
    .then(path => {
      return res.json({ code: 200, error: false, path });
    })
    .catch(err => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    });
});

router.post("/file", uploadFiles.single("files"), (req, res) => {
  if (req.fileValidationError) {
    return res
      .status(400)
      .json({ code: 400, error: true, message: req.fileValidationError });
  }

  UploadController.create(req.file)
    .then(path => {
      return res.json({ code: 200, error: false, path });
    })
    .catch(err => {
      return res.status(500).json({ code: 500, error: true, message: err.message })
    });
});

module.exports = router;
