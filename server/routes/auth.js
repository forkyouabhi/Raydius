import express from 'express';
import { requestOtp, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/request-otp
// @desc    Request a one-time password for login/signup
router.post('/request-otp', requestOtp);

// @route   POST /api/auth/verify-otp
// @desc    Verify the OTP and get a JWT token
router.post('/verify-otp', verifyOtp);

export default router;
