import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import AWS from 'aws-sdk';
import fs from 'fs';
import {
createCard,updateCard,deleteCard, getCardsByPack, getAllCards
} from '../Controllers/card-controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const uploadToS3 = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }
    
    const localFilePath = req.file.path;
    const fileContent = fs.readFileSync(localFilePath);
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `card-images/${req.file.filename}`,
      Body: fileContent,
      ContentType: req.file.mimetype,
    };
    
    const s3Upload = await s3.upload(params).promise();
    
    req.s3FileUrl = s3Upload.Location;
    
    next();
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading file to S3",
      error: error.message
    });
  }
};

router.get('/get-cards-by-pack/:packId', getCardsByPack);
router.post('/create-card', upload.single('image'), uploadToS3, createCard);
router.post('/update-card/:id', upload.single('image'), uploadToS3, updateCard);
router.delete('/delete-card/:id', deleteCard);
router.get('/get-all-cards', getAllCards);


export default router;