const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const config = require('config');

cloudinary.config({
  cloud_name: config.get('CLOUDINARY_NAME'),
  api_key: config.get('CLOUDINARY_API_KEY'),
  api_secret: config.get('CLOUDINARY_API_SECRET')
});

const resizeImg = async img => {
  // convert image to buffer, resize, & convert back to base64
  let parts = img.split(';');
  let mimType = parts[0].split(':')[1];
  let imageData = parts[1].split(',')[1];
  let bufferImg = Buffer(imageData, 'base64');
  let resizedImageBuffer = await sharp(bufferImg).resize(150, 150).withMetadata().toBuffer();
  let resizedImageData = resizedImageBuffer.toString('base64');
  let image = `data:${mimType};base64,${resizedImageData}`;
  return image;
};

module.exports = {
  upload: async img => {
    const resized = await resizeImg(img);
    const data = await cloudinary.uploader.upload(resized);
    return data.secure_url;
  },
  destroy: async img => {
    await cloudinary.uploader.destroy(img.slice(img.lastIndexOf('/') + 1, img.lastIndexOf('.')));
  }
};
