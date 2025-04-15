import express from 'express'
import { Login, Signup, sendOTP, verifyOTP, resetPassword, AdminSignup, AdminLogin } from '../Controllers/user-controller.js';

const router = express.Router();

router.post('/signup', Signup)
router.post('/login', Login)
router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)
router.post('/reset-password', resetPassword)
router.post('/admin-signup', AdminSignup)
router.post('/admin-login', AdminLogin)



export default router