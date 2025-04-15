import express from 'express'
import { getAllProducts , getAllUsers} from '../Controllers/admin-controller.js';

const router = express.Router();

router.get('/get-all-cards', getAllProducts)
router.get('/get-all-users', getAllUsers)

export default router;