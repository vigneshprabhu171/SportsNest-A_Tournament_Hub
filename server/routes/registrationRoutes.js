import express from 'express';
import {
  createRegistration,
  listMyRegistrations,
  listOrganizerRegistrations,
  listTournamentRegistrations,
  updateRegistrationStatus
} from '../controllers/registrationController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/tournaments/:tournamentId', protect, authorize('player'), createRegistration);
router.get('/me', protect, authorize('player'), listMyRegistrations);
router.get('/organizer', protect, authorize('organizer'), listOrganizerRegistrations);
router.get('/tournaments/:tournamentId', protect, authorize('organizer'), listTournamentRegistrations);
router.patch('/:id/status', protect, authorize('organizer'), updateRegistrationStatus);

export default router;
