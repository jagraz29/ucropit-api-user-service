const express = require('express');
const router = express.Router();

const UploadFile = require('../services/UploadFiles');

router.post('/files', (req, res) => {
  const upload = new UploadFile(req.files, 'uploads');
  upload
    .store()
    .then(result => {
      console.log(result);
      return res.json({ code: 200, error: false, result });
    })
    .catch(error => {
      return res
        .status(500)
        .json({ code: 500, error: true, message: error.message });
    });
});

module.exports = router;
