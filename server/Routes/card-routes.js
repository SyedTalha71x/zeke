import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getAllCardPacks,
  createCardPack,
  getCardPackById,
  updateCardPack, deleteCardPack
} from '../Controllers/card-controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

router.get('/get-all-cards', getAllCardPacks);
router.post('/create-card', upload.single('image'), createCardPack);
router.get('/get-single-card/:id', getCardPackById);
router.post('/update-card/:id', upload.single('image'), updateCardPack);
router.delete('/delete-card/:id', deleteCardPack);


export default router;