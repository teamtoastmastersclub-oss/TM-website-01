import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  usn: { type: String, required: true },
  description: { type: String, required: true },
  fileData: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
