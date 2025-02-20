const Video = require('../models/video');
const sharp = require('sharp');
const streamifier = require('streamifier')
const cloudinary = require("cloudinary").v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const videoController = {
    async uploadVideo(req, res) {
        try {
          const { title, description } = req.body;
          const userId = req.User.id; 
      
          const uploadToCloudinary = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: 'video', folder: 'videos' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await uploadToCloudinary();
          const video = new Video({
            userId,
            title,
            description,
            videoUrl:result.secure_url
          });
      
          await video.save();
          res.json({ message: 'Video uploaded successfully', video });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      },


      async getVideos(req, res) {
        try {
          const userId = req.User.id; 
          const videos = await Video.find({ userId });
          res.json(videos);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
}

module.exports = videoController;