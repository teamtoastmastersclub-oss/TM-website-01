import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  try {
    const { studentName, branch, sem, feedback } = req.body;

    if (!studentName || !branch || !sem || !feedback) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newFeedback = new Feedback({
      studentName,
      branch,
      sem,
      feedback
    });

    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error while submitting feedback' });
  }
};

export const getRecentFeedbacks = async (req, res) => {
  try {
    // Fetch 4 most recent
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(4).lean();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching recent feedbacks:', error);
    res.status(500).json({ message: 'Server error fetching feedbacks' });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
    res.status(500).json({ message: 'Server error fetching feedbacks' });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting feedback' });
  }
};
