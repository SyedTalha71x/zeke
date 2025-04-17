import express from 'express'
import { getAllProducts , getAllUsers, getAnalytics, getNotifications, markNotificationAsRead} from '../Controllers/admin-controller.js';

const router = express.Router();

router.get('/get-all-cards', getAllProducts)
router.get('/get-all-users', getAllUsers)
router.get('/get-analytics', getAnalytics)
router.get('/get-notifications', getNotifications)
router.post('/mark-notification-as-read/:id', markNotificationAsRead)


export default router;