import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

// Helper to get email domain
const getDomain = (email) => email.substring(email.lastIndexOf("@") + 1);

// --- Request OTP Controller ---
export const requestOtp = async (req, res) => {
  const schema = Joi.object({ email: Joi.string().email().required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  
  const { email } = value;
  const emailDomain = getDomain(email);

  const allowedDomains = (process.env.ALLOWED_DOMAINS || '').split(',');
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(403).json({ error: 'This university is not yet supported.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await User.findOneAndUpdate(
    { email },
    { emailDomain, otpHash, otpExpiresAt },
    { upsert: true, new: true }
  );
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM, to: email, subject: 'Your Raydius Login Code',
      text: `Your one-time login code is: ${otp}. It will expire in 10 minutes.`,
    });
    res.status(200).json({ message: 'Login code sent to your email.' });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ error: 'Failed to send login code.' });
  }
};

// --- Verify OTP Controller ---
export const verifyOtp = async (req, res) => {
  const schema = Joi.object({ email: Joi.string().email().required(), otp: Joi.string().length(6).required() });
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, otp } = value;
  const user = await User.findOne({ email });
  if (!user || !user.otpHash || !user.otpExpiresAt) return res.status(400).json({ error: 'Invalid request. Please request a code first.' });
  if (new Date() > user.otpExpiresAt) return res.status(400).json({ error: 'Your code has expired. Please request a new one.' });

  const isOtpValid = await bcrypt.compare(otp, user.otpHash);
  if (!isOtpValid) return res.status(400).json({ error: 'The code you entered is incorrect.' });
  
  user.verified = true;
  user.otpHash = undefined;
  user.otpExpiresAt = undefined;
  await user.save();
  
  const payload = { userId: user._id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(200).json({
    message: 'Login successful!', token,
    user: { id: user._id, email: user.email },
  });
};
