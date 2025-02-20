const express = require("express");
const userController = require("../controller/userController");
const tokenVerify = require("../middlewares/authMiddleware");
const { imageUpload } = require("../middlewares/upload");
const { storage } = require('../config/storage');
const multer = require('multer');
const upload = multer({ storage });

const router = express.Router();


router.post("/register", userController.register)

router.post("/login", userController.login)

router.post("/upload-profile-picture", tokenVerify, upload.single('image'), userController.imageUpload)

router.get('/user-info', tokenVerify, userController.getUserData)


module.exports = router;