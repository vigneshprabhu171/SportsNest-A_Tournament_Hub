import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const publicStatusFilter = { status: 'approved' };

export const listTournaments = asyncHandler(async (req, res) => {
  const { search, sportType, mode, stage, location } = req.query;
  const query = { ...publicStatusFilter };
  const now = new Date();

  if (search) query.$text = { $search: search };
  if (sportType) query.sportType = sportType;
  if (mode) query.mode = mode;
  if (location) query.location = new RegExp(location, 'i');
  if (stage === 'upcoming') query.tournamentDate = { $gt: now };
  if (stage === 'ongoing') {
    query.registrationStartDate = { $lte: now };
    query.tournamentDate = { $gte: now };
  }
  if (stage === 'completed') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    query.status = 'completed';
    query.tournamentDate = { $gte: monthAgo, $lt: now };
  }

  const tournaments = await Tournament.find(query).sort({ tournamentDate: 1 }).populate('organizer', 'name email');
  res.json({ tournaments });
});

export const getTournament = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id).populate('organizer', 'name email');
  if (!tournament) {
    res.status(404);
    throw new Error('Tournament not found');
  }
  if (tournament.status !== 'approved' && String(tournament.organizer?._id) !== String(req.user?._id) && req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Tournament is not public');
  }
  res.json({ tournament });
});

export const createTournament = asyncHandler(async (req, res) => {
  const bannerUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  const tournament = await Tournament.create({
    title: req.body.title,
    sportType: req.body.sportType,
    format: req.body.format,
    mode: req.body.mode,
    venueDetails: req.body.venueDetails,
    location: req.body.location,
    googleMapsLink: req.body.googleMapsLink,
    rules: req.body.rules,
    registrationStartDate: req.body.registrationStartDate,
    registrationEndDate: req.body.registrationEndDate,
    tournamentDate: req.body.tournamentDate,
    participantLimit: req.body.participantLimit,
    organizerContact: { email: req.body.contactEmail, phone: req.body.contactPhone },
    bannerUrl,
    prizeDetails: req.body.prizeDetails,
    description: req.body.description,
    organizer: req.user._id
  });
  res.status(201).json({ tournament });
});

export const updateTournament = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    res.status(404);
    throw new Error('Tournament not found');
  }
  if (String(tournament.organizer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Only the organizer can edit this tournament');
  }
  const updates = {
    title: req.body.title,
    sportType: req.body.sportType,
    format: req.body.format,
    mode: req.body.mode,
    venueDetails: req.body.venueDetails,
    location: req.body.location,
    googleMapsLink: req.body.googleMapsLink,
    rules: req.body.rules,
    registrationStartDate: req.body.registrationStartDate,
    registrationEndDate: req.body.registrationEndDate,
    tournamentDate: req.body.tournamentDate,
    participantLimit: req.body.participantLimit,
    organizerContact: {
      email: req.body.contactEmail || req.body.organizerContact?.email || tournament.organizerContact.email,
      phone: req.body.contactPhone || req.body.organizerContact?.phone
    },
    prizeDetails: req.body.prizeDetails,
    description: req.body.description,
    status: 'pending_approval'
  };
  if (req.file) updates.bannerUrl = `/uploads/${req.file.filename}`;
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) tournament[key] = value;
  });
  await tournament.save();
  res.json({ tournament });
});

export const organizerTournaments = asyncHandler(async (req, res) => {
  const tournaments = await Tournament.find({ organizer: req.user._id }).sort({ createdAt: -1 });
  const tournamentIds = tournaments.map((tournament) => tournament._id);
  const pendingRegistrations = await Registration.countDocuments({ tournament: { $in: tournamentIds }, status: 'pending' });
  res.json({ tournaments, pendingRegistrations });
});

export const saveTournament = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id);
  if (!tournament || tournament.status !== 'approved') {
    res.status(404);
    throw new Error('Tournament not found');
  }
  const user = await User.findById(req.user._id);
  const saved = user.savedTournaments.some((id) => String(id) === req.params.id);
  user.savedTournaments = saved ? user.savedTournaments.filter((id) => String(id) !== req.params.id) : [...user.savedTournaments, tournament._id];
  await user.save();
  res.json({ saved: !saved });
});

export const closeRegistration = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.id);
  if (!tournament) {
    res.status(404);
    throw new Error('Tournament not found');
  }
  if (String(tournament.organizer) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Only the organizer can close registration');
  }
  tournament.registrationClosed = true;
  await tournament.save();
  res.json({ tournament });
});

export const playerDashboard = asyncHandler(async (req, res) => {
  const [registrations, user] = await Promise.all([
    Registration.find({ player: req.user._id })
      .populate('tournament')
      .sort({ createdAt: -1 }),
    User.findById(req.user._id).populate('savedTournaments')
  ]);

  const savedTournaments = user.savedTournaments || [];
  const now = new Date();
  const participationHistory = registrations.filter((registration) => {
    const tournament = registration.tournament;
    return tournament?.status === 'completed' || new Date(tournament?.tournamentDate || 0) < now;
  });

  res.json({
    registrations,
    savedTournaments,
    participationHistory,
    stats: {
      registered: registrations.length,
      saved: savedTournaments.length,
      pending: registrations.filter((registration) => registration.status === 'pending').length,
      history: participationHistory.length
    }
  });
});
