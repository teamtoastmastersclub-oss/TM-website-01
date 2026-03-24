import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  heroCounts: [{
    title: { type: String, required: true },
    count: { type: Number, required: true }
  }],
  brevoSenderEmail: { type: String, default: '' },
  isSeeded: { type: Boolean, default: true, unique: true },

  // New CMS Fields
  heroText: {
    title: { type: String, default: "SPEAK WITH CONFIDENCE" },
    subtitle: { type: String, default: "KLECET Toastmasters Club — Where communication meets leadership, and potential becomes excellence." }
  },
  mission: {
    title: { type: String, default: "Building Leaders,\nOne Speech at a Time" },
    description1: { type: String, default: "Since our inception, KLECET Toastmasters Club has been dedicated to nurturing confident communicators and inspiring leaders. We believe that effective communication is the cornerstone of success in every aspect of life." },
    description2: { type: String, default: "Through structured programs, constructive feedback, and a supportive community, we empower our members to overcome their fears, articulate their ideas, and lead with conviction." },
    image: { type: String, default: "" },
    visionText: { type: String, default: "To be a premier platform for developing world-class communicators." },
    missionText: { type: String, default: "Provide a supportive environment for practicing communication skills." }
  },
  whyJoinUs: [{
    title: { type: String },
    description: { type: String },
    image: { type: String, default: "" }
  }],
  principal: {
    name: { type: String, default: "Dr. Rajesh Kumar" },
    message: { type: String, default: "In today's competitive world, communication and leadership skills are not just advantages—they are necessities. I encourage all students to actively participate in Toastmasters activities." },
    image: { type: String, default: "" }
  },
  footer: {
    logo: { type: String, default: "" },
    quickLinks: [{
      name: { type: String },
      url: { type: String }
    }],
    contact: {
      phone: { value: { type: String, default: "+91 98765 43210" }, visible: { type: Boolean, default: true } },
      email: { value: { type: String, default: "teamtoastmastersclub@gmail.com" }, visible: { type: Boolean, default: true } },
      address: { name: { type: String, default: "KLE College of Engineering, Belgaum" }, visible: { type: Boolean, default: true } }
    }
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
