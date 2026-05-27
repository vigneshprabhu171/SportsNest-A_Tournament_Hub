import { useEffect, useState } from 'react';
import TournamentCard from '../../components/tournaments/TournamentCard';
import TournamentFilters from '../../components/tournaments/TournamentFilters';
import Skeleton from '../../components/ui/Skeleton';
import { tournamentService } from '../../services/tournamentService';

export default function BrowseTournaments() {
  const [filters, setFilters] = useState({});
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await tournamentService.list(filters);
        setTournaments(data.tournaments);
      } catch {
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-soft dark:bg-white dark:text-slate-950">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-green-300 dark:text-green-700">Discover tournaments</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find your next competitive arena.</h1>
            <p className="mt-3 max-w-2xl text-slate-300 dark:text-slate-600">Search approved events by sport, mode, schedule, and location. Completed events are limited to the last month.</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 text-sm font-bold dark:bg-slate-950/10">{tournaments.length} visible events</div>
        </div>
      </section>
      <TournamentFilters filters={filters} setFilters={setFilters} />
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-80" />)}</div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tournaments.map((tournament) => <TournamentCard key={tournament._id} tournament={tournament} />)}
        </div>
      )}
    </div>
  );
}
