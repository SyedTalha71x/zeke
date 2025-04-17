import express from 'express'
import createPaymentIntent from '../api/create-payment-intent.js';
import { authMiddleware } from '../Middleware/auth.js';
const router = express.Router();
router.post('/create-payment-intent', authMiddleware,  createPaymentIntent);

export default router;
