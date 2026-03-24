import express from 'express';
import { submitFeedback, getRecentFeedbacks, getAllFeedbacks, deleteFeedback } from '../controllers/feedbackController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitFeedback);
router.get('/recent', getRecentFeedbacks);
router.get('/', getAllFeedbacks);
router.route('/:id').delete(protect, admin, deleteFeedback);

export default router;
