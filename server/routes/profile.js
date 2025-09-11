import express from 'express';
import { getMyProfile, updateMyProfile, getUploadUrl } from '../controllers/profileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js'; // We'll create this next

const router = express.Router();

// All profile routes should be protected, so we apply the auth middleware here.
router.use(authMiddleware);

// GET /api/profile/me - Fetches the logged-in user's profile
router.get('/me', getMyProfile);

// PUT /api/profile/me - Creates or updates the logged-in user's profile
router.put('/me', updateMyProfile);

// GET /api/profile/upload-url - Gets a secure URL to upload a photo to S3
router.get('/upload-url', getUploadUrl);

export default router;
