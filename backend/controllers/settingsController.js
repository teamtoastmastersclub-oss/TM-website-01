import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ isSeeded: true });
    
    // Default cards
    const defaultWhyJoinUs = [
      { title: "Master Public Speaking", description: "Overcome stage fright and speak confidently in front of any audience with structured practice." },
      { title: "Develop Leadership", description: "Take on club roles and develop essential leadership capabilities through hands-on experience." },
      { title: "Critical Thinking", description: "Enhance analytical skills through Table Topics and impromptu speeches that challenge your mind." },
      { title: "Career Growth", description: "Gain skills that employers value most: communication, leadership, and professional presence." },
      { title: "Supportive Community", description: "Learn and grow in a positive, encouraging environment with like-minded individuals." },
      { title: "Recognition & Awards", description: "Earn awards and track your progress through structured pathways and competitions." },
    ];

    // Seed default settings if none exist
    if (!settings) {
      settings = await Settings.create({
        heroCounts: [
          { title: 'Active Members', count: 120 },
          { title: 'Workshops Held', count: 45 },
          { title: 'Awards Won', count: 12 }
        ],
        brevoSenderEmail: 'masoommulla14@gmail.com',
        whyJoinUs: defaultWhyJoinUs
      });
    } else if (!settings.whyJoinUs || settings.whyJoinUs.length === 0) {
      // Patch existing document if it was created before the CMS update
      settings.whyJoinUs = defaultWhyJoinUs;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching settings', error: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { heroCounts, brevoSenderEmail, heroText, mission, whyJoinUs, principal, footer } = req.body;
    
    // Merge new fields, maintaining undefined to let Mongoose prevent overwriting or allow overriding
    const settings = await Settings.findOneAndUpdate(
      { isSeeded: true },
      { $set: { heroCounts, brevoSenderEmail, heroText, mission, whyJoinUs, principal, footer } },
      { new: true, upsert: true }
    );
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating settings', error: error.message });
  }
};
