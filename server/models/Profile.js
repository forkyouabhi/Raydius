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
  name: {
    type: String,
    trim: true,
  },
  age: Number,
  program: String,
  year: String,
  prompts: [
    {
      q: String, // The prompt question
      a: String, // The user's answer
    },
  ],
  photos: [String], // Array of URLs to photos in S3
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
