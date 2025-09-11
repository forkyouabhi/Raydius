import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  // Link to the User model
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true,
    index: true,
  },
  name: { type: String, trim: true },
  age: Number,
  program: { type: String, trim: true },
  year: String,
  interests: [String],
  prompts: [{
    q: String, // The prompt question
    a: String, // The user's answer
  }],
  photos: [String], // Array of public image URLs from S3
  discoverable: { type: Boolean, default: true },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
