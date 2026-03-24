import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  sem: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Query', querySchema);
