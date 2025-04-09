import express from 'express'
import { Login, Signup, sendOTP, verifyOTP, resetPassword } from '../Controllers/user-controller.js';

const router = express.Router();

router.post('/signup', Signup)
router.post('/login', Login)
router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword)


export default router