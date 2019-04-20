const express = require("express");
const router = express.Router();

router.use("/api", require("./auth"));

module.exports = router;