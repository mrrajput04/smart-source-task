const express = require("express");
const videoController = require("../controller/videoController");
const { videoUpload } = require("../middlewares/upload");
const tokenVerify = require("../middlewares/authMiddleware");
const { videoStorage } = require('../config/storage');
const multer = require('multer');
const upload = multer({ videoStorage });

const router = express.Router();


router.post('/upload-video', tokenVerify, upload.single('video'), videoController.uploadVideo);
router.get('/videos', tokenVerify,  videoController.getVideos);


module.exports = router;