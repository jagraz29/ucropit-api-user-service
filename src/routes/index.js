const express = require("express");
const router = express.Router();

router.use("/api/auth", require("./auth"));
router.use("/api/crops", require("./crop"));
router.use("/api/fields", require("./field"));
router.use("/api/lots", require("./lot"));

module.exports = router