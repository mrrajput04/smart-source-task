const multer = require('multer');

const imageUpload = multer({
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Please upload an image file'));
        }
        cb(null, true);
    }
});

module.exports = { imageUpload }