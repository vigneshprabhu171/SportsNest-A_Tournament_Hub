import { CalendarDays, MapPin, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

const statusTone = {
  approved: 'green',
  pending_approval: 'amber',
  rejected: 'red',
  suspended: 'red',
  cancelled: 'red',
  completed: 'blue'
};

export default function TournamentCard({ tournament }) {
  const slotsLeft = Math.max((tournament.participantLimit || 0) - (tournament.approvedRegistrations || 0), 0);

  return (
    <Link to={`/tournaments/${tournament._id}`} className="group glass-panel block overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 bg-slate-200 dark:bg-slate-800">
        {tournament.bannerUrl ? (
          <img src={tournament.bannerUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-[linear-gradient(135deg,_#0f172a,_#16a34a)] text-5xl font-black text-white">
            {tournament.sportType?.slice(0, 2) || 'SN'}
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone={statusTone[tournament.status] || 'slate'}>{tournament.status?.replace('_', ' ')}</Badge>
          {slotsLeft === 0 && <Badge tone="red">Full</Badge>}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-green-600 dark:text-green-400">{tournament.sportType}</p>
            <h3 className="mt-1 line-clamp-2 text-lg font-black text-slate-950 transition group-hover:text-green-700 dark:text-white dark:group-hover:text-green-300">{tournament.title}</h3>
          </div>
          <Star size={19} className="text-slate-300 transition group-hover:text-amber-400" />
        </div>
        <div className="mt-4 grid gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2"><CalendarDays size={16} /> {new Date(tournament.tournamentDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-2"><MapPin size={16} /> {tournament.mode === 'online' ? 'Online' : tournament.location || 'Venue pending'}</span>
          <span className="flex items-center gap-2"><Users size={16} /> {slotsLeft} slots left</span>
        </div>
      </div>
    </Link>
  );
}
