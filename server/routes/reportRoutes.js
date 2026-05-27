import express from 'express';
import { createReport, listReports, updateReport } from '../controllers/reportController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/tournaments/:tournamentId', protect, authorize('player'), createReport);
router.get('/', protect, authorize('admin'), listReports);
router.patch('/:id', protect, authorize('admin'), updateReport);

export default router;
