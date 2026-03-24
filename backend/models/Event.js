import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  rules: { type: String, required: true },
  date: { type: String, required: true },
  timeFrom: { type: String, required: true },
  timeTo: { type: String, required: true },
  venue: { type: String, required: true },
  banner: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['upcoming', 'past'], 
    default: 'upcoming' 
  },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  winners: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String },
    image: { type: String }
  }],
  gallery: [{ type: String }] // Base64 image strings or URLs
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
