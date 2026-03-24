import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
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
  feedback: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
