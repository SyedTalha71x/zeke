import express from 'express'
import { getAllProducts , getAllUsers, getAnalytics, getNotifications} from '../Controllers/admin-controller.js';

const router = express.Router();

router.get('/get-all-cards', getAllProducts)
router.get('/get-all-users', getAllUsers)
router.get('/get-analytics', getAnalytics)
router.get('/get-notifications', getNotifications)

export default router;