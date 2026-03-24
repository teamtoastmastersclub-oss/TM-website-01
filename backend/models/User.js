import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: true,
  },
  fullName: { type: String, required: true },
  usn: { type: String, required: true },
  branch: { type: String, required: true },
  sem: { type: String, required: true },
  mobile: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  username: { type: String, unique: true, sparse: true },
  isSuspended: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
