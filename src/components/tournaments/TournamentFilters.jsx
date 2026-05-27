import { Search } from 'lucide-react';
import { sports } from '../../utils/constants';
import { cn } from '../../utils/cn';

export default function TournamentFilters({ filters, setFilters }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-950">
          <Search size={18} className="text-slate-400" />
          <input className="w-full bg-transparent py-3 text-sm" placeholder="Search tournaments" value={filters.search || ''} onChange={(event) => update('search', event.target.value)} />
        </label>
        <select className={cn('field', !filters.sportType && 'text-slate-400')} value={filters.sportType || ''} onChange={(event) => update('sportType', event.target.value)}>
          <option value="" disabled hidden>Select sport</option>
          {sports.map((sport) => <option key={sport} value={sport}>{sport}</option>)}
        </select>
        <select className={cn('field', !filters.mode && 'text-slate-400')} value={filters.mode || ''} onChange={(event) => update('mode', event.target.value)}>
          <option value="" disabled hidden>Select mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        <select className={cn('field', !filters.stage && 'text-slate-400')} value={filters.stage || ''} onChange={(event) => update('stage', event.target.value)}>
          <option value="" disabled hidden>Select stage</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <input className="field" placeholder="Location" value={filters.location || ''} onChange={(event) => update('location', event.target.value)} />
      </div>
    </div>
  );
}
