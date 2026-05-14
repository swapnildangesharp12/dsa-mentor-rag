const express = require("express");
const multer = require("multer");
const { uploadPDF, chat } = require("../controllers/chatController");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadPDF);
router.post("/chat", chat);

module.exports = router;