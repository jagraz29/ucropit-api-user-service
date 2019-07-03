const path = require("path");
const validTypes = (req, file, cb, type) => {
  const fileTypes = type == "images" ? /jpeg|jpg|png/ : /pdf|doc|docx/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    req.fileValidationError = "goes wrong on the mimetype";
    cb(null, false, new Error("Error: Archivo o imágen no permitido"));
  }
};

module.exports = {
  validTypes
};
