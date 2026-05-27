import Notification from '../models/Notification.js';
import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createRegistration = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.tournamentId);
  const now = new Date();
  if (!tournament || tournament.status !== 'approved') {
    res.status(404);
    throw new Error('Tournament is not available for registration');
  }
  if (tournament.registrationClosed || now > tournament.registrationEndDate) {
    res.status(400);
    throw new Error('Registration is closed');
  }
  if (tournament.approvedRegistrations >= tournament.participantLimit) {
    res.status(400);
    throw new Error('Registration full');
  }

  const existing = await Registration.findOne({ tournament: tournament._id, player: req.user._id });
  if (existing) {
    res.status(409);
    throw new Error('You have already registered for this tournament');
  }

  const registration = await Registration.create({
    tournament: tournament._id,
    player: req.user._id,
    type: req.body.type,
    teamName: req.body.teamName,
    teamMembers: req.body.teamMembers
  });

  res.status(201).json({ registration });
});

export const listTournamentRegistrations = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.tournamentId);
  if (!tournament || String(tournament.organizer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not allowed to view registrations');
  }
  const registrations = await Registration.find({ tournament: tournament._id }).populate('player', 'name email');
  res.json({ registrations });
});

export const listMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ player: req.user._id })
    .populate('tournament')
    .sort({ createdAt: -1 });
  res.json({ registrations });
});

export const listOrganizerRegistrations = asyncHandler(async (req, res) => {
  const tournaments = await Tournament.find({ organizer: req.user._id }).select('_id title sportType participantLimit approvedRegistrations');
  const registrations = await Registration.find({ tournament: { $in: tournaments.map((tournament) => tournament._id) } })
    .populate('player', 'name email')
    .populate('tournament', 'title sportType participantLimit approvedRegistrations')
    .sort({ createdAt: -1 });
  res.json({ registrations, tournaments });
});

export const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id).populate('tournament');
  if (!registration || String(registration.tournament.organizer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Not allowed to update this registration');
  }

  const nextStatus = req.body.status;
  if (!['approved', 'rejected'].includes(nextStatus)) {
    res.status(400);
    throw new Error('Status must be approved or rejected');
  }

  if (nextStatus === 'approved' && registration.status !== 'approved') {
    if (registration.tournament.approvedRegistrations >= registration.tournament.participantLimit) {
      res.status(400);
      throw new Error('Tournament is already full');
    }
    registration.tournament.approvedRegistrations += 1;
    await registration.tournament.save();
  }

  if (nextStatus === 'rejected' && registration.status === 'approved') {
    registration.tournament.approvedRegistrations = Math.max(registration.tournament.approvedRegistrations - 1, 0);
    await registration.tournament.save();
  }

  registration.status = nextStatus;
  registration.organizerNote = req.body.organizerNote;
  await registration.save();

  await Notification.create({
    user: registration.player,
    title: `Registration ${nextStatus}`,
    message: `Your registration for ${registration.tournament.title} was ${nextStatus}.`,
    type: nextStatus === 'approved' ? 'registration_approved' : 'registration_rejected',
    metadata: { tournament: registration.tournament._id }
  });

  res.json({ registration });
});
