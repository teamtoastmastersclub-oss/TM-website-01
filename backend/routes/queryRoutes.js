import express from 'express';
import { submitQuery, getAllQueries, deleteQuery } from '../controllers/queryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(submitQuery).get(protect, admin, getAllQueries);
router.route('/:id').delete(protect, admin, deleteQuery);

export default router;
