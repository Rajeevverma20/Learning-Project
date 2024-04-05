const cloudinary = require('cloudinary').v2;
require('dotenv').config();


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result.url);
      }
    });
  });
};

module.exports = {
  uploadImageToCloudinary
};