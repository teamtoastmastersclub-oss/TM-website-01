import express from 'express';
import { getTeam, updateTeam } from '../controllers/teamController.js';

const router = express.Router();

router.get('/', getTeam);
router.put('/', updateTeam);

export default router;
