import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    index: true 
  },
  emailDomain: { 
    type: String,
    required: true,
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  otpHash: String,
  otpExpiresAt: Date,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
