const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile_pictures',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    }
});

const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'videos',
        allowedFormats: ['mp4'],
    }
});

module.exports = {
    storage, videoStorage
};

