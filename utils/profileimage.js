const cloudinary = require('cloudinary').v2;
require('dotenv').config();


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

const uploadImageToCloudinary = async (file) => {
  try{
    const result = await cloudinary.uploader.upload(file.content,{resource_type: "image"});
    console.log(result.secure_url);
    return result.secure_url;
  }
  catch(err){
    console.log(err);
  }
};
module.exports = {
  uploadImageToCloudinary
};