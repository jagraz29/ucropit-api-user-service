const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");


router.use("/api/auth", require("./auth"));
router.use("/api/crops",authMiddleware.checkToken,require("./crop"));
router.use("/api/fields", authMiddleware.checkToken, require("./field"));
router.use("/api/concepts", authMiddleware.checkToken,require("./concept"));
router.use("/api/lots", require("./lot"));
router.use("/api/signs", authMiddleware.checkToken, require("./sign"));
router.use("/api/files", require("./upload"))
router.use("/api/providers",require("./provider"));

module.exports = router;
