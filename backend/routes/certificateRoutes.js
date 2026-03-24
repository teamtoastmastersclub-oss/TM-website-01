import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  createCertificate, 
  getAllCertificates, 
  deleteCertificate, 
  getMyCertificates 
} from '../controllers/certificateController.js';

const router = express.Router();

// User routes
router.get('/my', protect, getMyCertificates);

// Admin routes
router.post('/', protect, admin, createCertificate);
router.get('/', protect, admin, getAllCertificates);
router.delete('/:id', protect, admin, deleteCertificate);

export default router;
