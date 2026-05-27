import Notification from '../models/Notification.js';
import Registration from '../models/Registration.js';
import Tournament from '../models/Tournament.js';

const dayMs = 24 * 60 * 60 * 1000;

async function notifyRegisteredPlayers(tournament, type, title, message) {
  const registrations = await Registration.find({ tournament: tournament._id, status: 'approved' }).select('player');
  const notifications = [];
  for (const registration of registrations) {
    const exists = await Notification.exists({
      user: registration.player,
      type,
      'metadata.tournament': tournament._id
    });
    if (!exists) {
      notifications.push({
        user: registration.player,
        title,
        message,
        type,
        metadata: { tournament: tournament._id }
      });
    }
  }
  if (notifications.length) await Notification.insertMany(notifications);
  return notifications.length;
}

export async function runTournamentReminders() {
  const now = new Date();
  const closingSoonEnd = new Date(now.getTime() + dayMs);
  const startingSoonEnd = new Date(now.getTime() + 2 * dayMs);

  const closingSoon = await Tournament.find({
    status: 'approved',
    registrationClosed: false,
    registrationEndDate: { $gte: now, $lte: closingSoonEnd }
  });

  const startingSoon = await Tournament.find({
    status: 'approved',
    tournamentDate: { $gte: now, $lte: startingSoonEnd }
  });

  let created = 0;

  for (const tournament of closingSoon) {
    created += await notifyRegisteredPlayers(
      tournament,
      'registration_closing',
      'Registration closing soon',
      `${tournament.title} registration closes soon.`
    );
  }

  for (const tournament of startingSoon) {
    created += await notifyRegisteredPlayers(
      tournament,
      'tournament_starting',
      'Tournament starting soon',
      `${tournament.title} starts soon.`
    );
  }

  return { created, closingSoon: closingSoon.length, startingSoon: startingSoon.length };
}
