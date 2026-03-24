import express from 'express';
import { getEvents, getEventById, createEvent, toggleAttendance, moveToPast, deleteEvent } from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly readable endpoints (for landing page / dashboard / event details)
router.route('/').get(getEvents);
router.route('/:id').get(getEventById).delete(protect, admin, deleteEvent);

// Admin-only mutable endpoints
router.post('/', protect, admin, createEvent);
router.put('/attendance', protect, admin, toggleAttendance);
router.put('/:eventId/past', protect, admin, moveToPast);

export default router;
