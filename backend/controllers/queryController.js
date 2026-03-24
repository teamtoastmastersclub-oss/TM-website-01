import Query from '../models/Query.js';

export const submitQuery = async (req, res) => {
  try {
    const { studentName, branch, sem, description } = req.body;

    if (!studentName || !branch || !sem || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newQuery = new Query({
      studentName,
      branch,
      sem,
      description
    });

    await newQuery.save();

    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ message: 'Server error while submitting query' });
  }
};

export const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching queries' });
  }
};

export const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    res.json({ message: 'Query removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting query' });
  }
};
