import Certificate from '../models/Certificate.js';
import User from '../models/User.js';

// ADMIN: Create a new certificate for a user by USN
export const createCertificate = async (req, res) => {
  try {
    const { usn, description, fileData } = req.body;
    if (!usn || !description || !fileData) {
      return res.status(400).json({ message: 'USN, description, and file data are required.' });
    }

    const normalizedUsn = usn.trim().toUpperCase();
    const user = await User.findOne({ usn: normalizedUsn });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with the provided USN.' });
    }

    const certificate = new Certificate({
      user: user._id,
      usn: normalizedUsn,
      description,
      fileData
    });

    await certificate.save();
    
    // Repopulate to send back
    const popCert = await Certificate.findById(certificate._id).populate('user', 'fullName usn branch sem');
    res.status(201).json(popCert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating certificate', error: error.message });
  }
};

// ADMIN: Get all certificates
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate('user', 'fullName usn branch sem')
      .sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificates', error: error.message });
  }
};

// ADMIN: Delete a certificate
export const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const certificate = await Certificate.findByIdAndDelete(id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting certificate', error: error.message });
  }
};

// USER: Get my certificates
export const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your certificates', error: error.message });
  }
};
