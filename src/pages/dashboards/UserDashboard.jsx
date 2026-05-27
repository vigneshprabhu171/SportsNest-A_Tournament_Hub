import { Bell, Bookmark, Medal, Trophy } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import Skeleton from '../../components/ui/Skeleton';
import StatsCard from '../../components/ui/StatsCard';
import { useAsync } from '../../hooks/useAsync';
import { tournamentService } from '../../services/tournamentService';

export default function UserDashboard() {
  const { data, loading } = useAsync(async () => {
    const response = await tournamentService.playerDashboard();
    return response.data;
  }, []);

  if (loading) return <Skeleton className="h-[520px]" />;

  const registrations = data?.registrations || [];
  const savedTournaments = data?.savedTournaments || [];

  return (
    <div className="space-y-6">
      <Header title="Player dashboard" body="Track your registrations, saved tournaments, participation history, and notifications." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Registered" value={data?.stats?.registered || 0} icon={Trophy} hint={`${data?.stats?.pending || 0} awaiting approval`} />
        <StatsCard label="Saved" value={data?.stats?.saved || 0} icon={Bookmark} hint="Bookmarked tournaments" />
        <StatsCard label="Notifications" value="5" icon={Bell} hint="Unread updates" />
        <StatsCard label="History" value={data?.stats?.history || 0} icon={Medal} hint="Past participation" />
      </div>

      <section className="space-y-3">
        <h2 className="text-2xl font-black tracking-tight">Registered tournaments</h2>
        <DataTable
          columns={[
            { key: 'title', label: 'Tournament', render: (row) => row.tournament?.title },
            { key: 'sport', label: 'Sport', render: (row) => row.tournament?.sportType },
            { key: 'date', label: 'Date', render: (row) => row.tournament?.tournamentDate ? new Date(row.tournament.tournamentDate).toLocaleDateString() : '-' },
            { key: 'type', label: 'Entry', render: (row) => row.type === 'team' ? row.teamName || 'Team' : 'Individual' },
            { key: 'status', label: 'Status', render: (row) => <Badge tone={row.status === 'approved' ? 'green' : row.status === 'rejected' ? 'red' : 'amber'}>{row.status}</Badge> }
          ]}
          rows={registrations}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-black tracking-tight">Saved tournaments</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedTournaments.map((tournament) => (
            <div key={tournament._id} className="glass-panel rounded-2xl p-5">
              <Badge tone="blue">{tournament.sportType}</Badge>
              <h2 className="mt-3 text-lg font-black">{tournament.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{new Date(tournament.tournamentDate).toLocaleDateString()} - {tournament.location || tournament.mode}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Header({ title, body }) {
  return (
    <section>
      <p className="text-sm font-black uppercase tracking-wide text-green-600 dark:text-green-400">Personal command center</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{body}</p>
    </section>
  );
}
