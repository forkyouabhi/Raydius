import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getMyProfile, updateMyProfile, getUploadUrl } from '../controllers/profileController.js';

const router = express.Router();

// Protect all profile routes with the auth middleware
router.use(authMiddleware);

// @route   GET /api/profile/me
// @desc    Get the logged-in user's profile
router.get('/me', getMyProfile);

// @route   PUT /api/profile/me
// @desc    Create or update the logged-in user's profile
router.put('/me', updateMyProfile);

// @route   GET /api/profile/upload-url
// @desc    Get a secure, pre-signed URL to upload a photo to S3
router.get('/upload-url', getUploadUrl);

export default router;
