import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import Registration from '../models/Registration.js';
import Report from '../models/Report.js';
import Tournament from '../models/Tournament.js';
import User from '../models/User.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sportsnest';

async function seed() {
  await mongoose.connect(mongoUri);
  await Promise.all([
    User.deleteMany(),
    Tournament.deleteMany(),
    Registration.deleteMany(),
    Report.deleteMany(),
    Notification.deleteMany()
  ]);

  const [admin, organizer, player] = await User.create([
    {
      name: 'SportsNest Admin',
      email: process.env.ADMIN_EMAIL || 'admin@sportsnest.local',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin'
    },
    {
      name: 'Aarav Organizer',
      email: 'organizer@sportsnest.local',
      password: 'Organizer@123',
      role: 'organizer'
    },
    {
      name: 'Maya Player',
      email: 'player@sportsnest.local',
      password: 'Player@123',
      role: 'player'
    }
  ]);

  const now = new Date();
  const daysFromNow = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const tournaments = await Tournament.create([
    {
      title: 'Metro Football Championship',
      sportType: 'Football',
      format: 'Knockout',
      mode: 'offline',
      venueDetails: 'Sports Arena, Bengaluru',
      location: 'Bengaluru',
      googleMapsLink: 'https://maps.google.com',
      rules: 'Teams must report 30 minutes before kickoff. Standard futsal rules apply.',
      registrationStartDate: daysFromNow(-2),
      registrationEndDate: daysFromNow(10),
      tournamentDate: daysFromNow(16),
      participantLimit: 24,
      organizerContact: { email: 'organizer@sportsnest.local', phone: '+91 99999 99999' },
      prizeDetails: 'Trophy plus cash prize',
      description: 'A high-energy city football tournament for amateur clubs.',
      status: 'approved',
      organizer: organizer._id,
      approvedRegistrations: 1
    },
    {
      title: 'Rapid Chess Open',
      sportType: 'Chess',
      format: 'Swiss',
      mode: 'online',
      venueDetails: 'Lichess private arena',
      location: 'Online',
      rules: 'Rapid 10+5 time control. Fair play checks enabled.',
      registrationStartDate: daysFromNow(-1),
      registrationEndDate: daysFromNow(5),
      tournamentDate: daysFromNow(8),
      participantLimit: 128,
      organizerContact: { email: 'organizer@sportsnest.local' },
      description: 'Online rapid chess event for rated and unrated players.',
      status: 'pending_approval',
      organizer: organizer._id
    },
    {
      title: 'Downtown Badminton Ladder',
      sportType: 'Badminton',
      format: 'League',
      mode: 'offline',
      venueDetails: 'Court 4, Downtown Club',
      location: 'Mumbai',
      rules: 'Yonex shuttles provided. Best of three games.',
      registrationStartDate: daysFromNow(-10),
      registrationEndDate: daysFromNow(3),
      tournamentDate: daysFromNow(12),
      participantLimit: 32,
      organizerContact: { email: 'organizer@sportsnest.local' },
      status: 'approved',
      organizer: organizer._id
    }
  ]);

  await Registration.create({
    tournament: tournaments[0]._id,
    player: player._id,
    type: 'individual',
    status: 'approved'
  });

  await Report.create({
    tournament: tournaments[0]._id,
    reporter: player._id,
    reason: 'Suspicious organizer contact',
    details: 'Demo report for admin dashboard.'
  });

  await Notification.create({
    user: player._id,
    title: 'Registration approved',
    message: 'Your Metro Football Championship registration was approved.',
    type: 'registration_approved',
    metadata: { tournament: tournaments[0]._id }
  });

  console.log('Seed complete');
  console.log(`Admin: ${admin.email}`);
  console.log('Organizer: organizer@sportsnest.local / Organizer@123');
  console.log('Player: player@sportsnest.local / Player@123');
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
