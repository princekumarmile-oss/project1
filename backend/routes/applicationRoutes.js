const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createApplication } = require("../controllers/applicationController");

const router = express.Router();

router.post("/", authMiddleware, createApplication);

module.exports = router;
