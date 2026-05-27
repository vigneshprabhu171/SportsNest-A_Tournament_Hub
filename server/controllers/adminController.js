import Notification from '../models/Notification.js';
import Report from '../models/Report.js';
import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { runTournamentReminders } from '../utils/reminderJobs.js';

export const dashboard = asyncHandler(async (_req, res) => {
  const [pendingTournaments, pendingApprovals, openReports, suspended, organizers] = await Promise.all([
    Tournament.find({ status: 'pending_approval' }).populate('organizer', 'name email').sort({ createdAt: -1 }),
    Tournament.countDocuments({ status: 'pending_approval' }),
    Report.countDocuments({ status: { $in: ['open', 'reviewing'] } }),
    Tournament.countDocuments({ status: 'suspended' }),
    User.countDocuments({ role: 'organizer', isActive: true })
  ]);
  res.json({ pendingTournaments, stats: { pendingApprovals, openReports, suspended, organizers } });
});

export const moderateTournament = (status) => asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id).populate('organizer', 'name email');
  if (!tournament) {
    res.status(404);
    throw new Error('Tournament not found');
  }

  tournament.status = status;
  if (status === 'rejected') tournament.rejectionReason = req.body.reason;
  if (status === 'suspended') tournament.suspendedReason = req.body.reason;
  await tournament.save();

  await Notification.create({
    user: tournament.organizer._id,
    title: `Tournament ${status.replace('_', ' ')}`,
    message: `${tournament.title} is now ${status.replace('_', ' ')}.`,
    type: status === 'cancelled' ? 'tournament_cancelled' : 'system',
    metadata: { tournament: tournament._id }
  });

  res.json({ tournament });
});

export const runReminders = asyncHandler(async (_req, res) => {
  const result = await runTournamentReminders();
  res.json(result);
});
