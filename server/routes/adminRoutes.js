import express from 'express';
import { dashboard, moderateTournament, runReminders } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('admin'));
router.get('/dashboard', dashboard);
router.post('/notifications/run-reminders', runReminders);
router.patch('/tournaments/:id/approve', moderateTournament('approved'));
router.patch('/tournaments/:id/reject', moderateTournament('rejected'));
router.patch('/tournaments/:id/suspend', moderateTournament('suspended'));
router.patch('/tournaments/:id/cancel', moderateTournament('cancelled'));

export default router;
