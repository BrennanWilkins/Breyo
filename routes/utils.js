const COLORS = ['#f05544', '#f09000', '#489a3c', '#0079bf', '#7150df',
  '#38bbf4', '#ad5093', '#4a32dd', '#046b8b'];

const PHOTO_IDS = ['1607556049122-5e3874a25a1f', '1605325811474-ba58cf3180d8', '1513580638-fda5563960d6',
'1554129352-f8c3ab6d5595', '1596709097416-6d4206796022', '1587732282555-321fddb19dc0',
'1605580556856-db8fae94b658', '1605738862138-6704bedb5202', '1605447781678-2a5baca0e07b'];

const LABEL_COLORS = ['#60C44D', '#F5DD2A', '#FF8C00', '#F60000', '#3783FF', '#4815AA'];

const sharp = require('sharp');

const resizeImg = async img => {
  try {
    // convert image to buffer, resize, & convert back to base64
    let parts = img.split(';');
    let mimType = parts[0].split(':')[1];
    let imageData = parts[1].split(',')[1];
    let bufferImg = Buffer(imageData, 'base64');
    let resizedImageBuffer = await sharp(bufferImg).resize(150, 150).withMetadata().toBuffer();
    let resizedImageData = resizedImageBuffer.toString('base64');
    let image = `data:${mimType};base64,${resizedImageData}`;
    return image;
  } catch (err) { return new Error('Failed to resize image'); }
};

const cloudinary = require('cloudinary').v2;
const config = require('config');

cloudinary.config({
  cloud_name: config.get('CLOUDINARY_NAME'),
  api_key: config.get('CLOUDINARY_API_KEY'),
  api_secret: config.get('CLOUDINARY_API_SECRET')
});

const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 12);

module.exports = { COLORS, PHOTO_IDS, LABEL_COLORS, resizeImg, cloudinary: cloudinary.uploader, nanoid };
