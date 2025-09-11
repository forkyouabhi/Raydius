import Profile from '../models/Profile.js';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from 'crypto';

// --- Get My Profile ---
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });
    if (!profile) {
      // It's not an error if a new user doesn't have a profile yet.
      return res.status(200).json(null);
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching profile.' });
  }
};

// --- Create or Update My Profile ---
export const updateMyProfile = async (req, res) => {
  const { name, age, program, year, prompts, photos } = req.body;
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.userId },
      { name, age, program, year, prompts, photos, userId: req.user.userId },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Server error while updating profile.' });
  }
};

// --- Get Secure Upload URL ---
export const getUploadUrl = async (req, res) => {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });

    // Generate a unique file name to prevent collisions
    const randomFileName = crypto.randomBytes(16).toString('hex');
    const key = `photos/${req.user.userId}/${randomFileName}.jpg`;

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: 'image/jpeg',
    });

    try {
        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // URL is valid for 60 seconds
        const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        res.json({ uploadUrl, publicUrl });
    } catch (error) {
        res.status(500).json({ error: 'Could not generate upload URL.' });
    }
};
