import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { configDotenv } from 'dotenv';

configDotenv();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'card-packs',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

export { cloudinary, storage };
