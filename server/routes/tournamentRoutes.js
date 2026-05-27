import express from 'express';
import {
  closeRegistration,
  createTournament,
  getTournament,
  listTournaments,
  organizerTournaments,
  playerDashboard,
  saveTournament,
  updateTournament
} from '../controllers/tournamentController.js';
import { authorize, optionalProtect, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', listTournaments);
router.get('/player/dashboard', protect, authorize('player'), playerDashboard);
router.get('/organizer/mine', protect, authorize('organizer'), organizerTournaments);
router.post('/', protect, authorize('organizer'), upload.single('banner'), createTournament);
router.get('/:id', optionalProtect, getTournament);
router.put('/:id', protect, authorize('organizer'), upload.single('banner'), updateTournament);
router.post('/:id/save', protect, authorize('player'), saveTournament);
router.patch('/:id/close-registration', protect, authorize('organizer'), closeRegistration);

export default router;
