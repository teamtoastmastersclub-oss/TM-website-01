import express from 'express';
import { getUserProfile, updateUserProfile, getUsers, toggleSuspendUser, deleteUser, changePassword } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/me').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/me/password').put(protect, changePassword);
router.route('/admin/users').get(protect, admin, getUsers);
router.route('/admin/users/:id/suspend').put(protect, admin, toggleSuspendUser);
router.route('/admin/users/:id').delete(protect, admin, deleteUser);

export default router;
