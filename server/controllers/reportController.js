import Report from '../models/Report.js';
import Tournament from '../models/Tournament.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createReport = asyncHandler(async (req, res) => {
  const tournament = await Tournament.findById(req.params.tournamentId);
  if (!tournament) {
    res.status(404);
    throw new Error('Tournament not found');
  }
  const report = await Report.create({
    tournament: tournament._id,
    reporter: req.user._id,
    reason: req.body.reason,
    details: req.body.details
  });
  res.status(201).json({ report });
});

export const listReports = asyncHandler(async (_req, res) => {
  const reports = await Report.find().populate('tournament', 'title status').populate('reporter', 'name email').sort({ createdAt: -1 });
  res.json({ reports });
});

export const updateReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }
  report.status = req.body.status || report.status;
  report.adminNote = req.body.adminNote;
  await report.save();
  await report.populate('tournament', 'title status');
  await report.populate('reporter', 'name email');
  res.json({ report });
});
