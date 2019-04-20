"use strict";
const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

router.post("/register", async (req, res, next) => {
    try {
        const data = req.body
        const result = await AuthController.register(data)
        
        res.json(result)
    } catch (error) {
        res.status(400).send({ error: error.errors })
    }
});

module.exports = router;