import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  principal: {
    name: { type: String, default: 'Dr. Principal Name' },
    title: { type: String, default: 'Principal' },
    message: { type: String, default: 'Welcome to our institution.' },
    image: { type: String, default: '' }
  },
  faculties: [{
    name: { type: String, required: true },
    image: { type: String, default: '' }
  }],
  coordinators: [{
    usn: { type: String, required: true },
    title: { type: String, required: true },
    name: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    branch: { type: String, default: '' },
    sem: { type: String, default: '' }
  }]
}, { timestamps: true });

export default mongoose.model('Team', teamSchema);
