import { CheckCircle2, Clock, ShieldAlert, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import StatsCard from '../../components/ui/StatsCard';
import { useAsync } from '../../hooks/useAsync';
import { tournamentService } from '../../services/tournamentService';

export default function OrganizerDashboard() {
  const { data } = useAsync(async () => {
    const response = await tournamentService.mine();
    return response.data;
  }, []);
  const registrationsState = useAsync(async () => {
    const response = await tournamentService.registrations();
    return response.data.registrations;
  }, []);
  const tournaments = data?.tournaments || [];
  const registrations = registrationsState.data || [];

  const decide = async (id, status) => {
    try {
      await tournamentService.updateRegistration(id, { status });
      toast.success(`Registration ${status}`);
      registrationsState.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update registration');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <section>
          <p className="text-sm font-black uppercase tracking-wide text-green-600 dark:text-green-400">Organizer workspace</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Manage tournaments</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Create events, review registrations, close entries, and monitor approval status.</p>
        </section>
        <Link className="btn-primary" to="/organizer/tournaments/new">Create tournament</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Created" value={tournaments.length} icon={Users} />
        <StatsCard label="Pending approval" value={tournaments.filter((item) => item.status === 'pending_approval').length} icon={Clock} />
        <StatsCard label="Approved" value={tournaments.filter((item) => item.status === 'approved').length} icon={CheckCircle2} />
        <StatsCard label="Registration requests" value={data?.pendingRegistrations || 0} icon={ShieldAlert} />
      </div>
      <DataTable
        columns={[
          { key: 'title', label: 'Tournament' },
          { key: 'sportType', label: 'Sport' },
          { key: 'mode', label: 'Mode' },
          { key: 'participantLimit', label: 'Limit' },
          { key: 'status', label: 'Approval', render: (row) => <Badge tone={row.status === 'approved' ? 'green' : row.status === 'pending_approval' ? 'amber' : 'red'}>{row.status.replace('_', ' ')}</Badge> },
          { key: 'actions', label: 'Actions', render: (row) => <Link className="font-bold text-green-700 dark:text-green-300" to={`/organizer/tournaments/${row._id}/edit`}>Edit</Link> }
        ]}
        rows={tournaments}
      />
      <section className="space-y-3">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Registration requests</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Approve or reject individual and team entries.</p>
        </div>
        <DataTable
          columns={[
            { key: 'player', label: 'Player', render: (row) => row.player?.name },
            { key: 'tournament', label: 'Tournament', render: (row) => row.tournament?.title },
            { key: 'type', label: 'Entry', render: (row) => row.type === 'team' ? row.teamName || 'Team' : 'Individual' },
            { key: 'status', label: 'Status', render: (row) => <Badge tone={row.status === 'approved' ? 'green' : row.status === 'rejected' ? 'red' : 'amber'}>{row.status}</Badge> },
            {
              key: 'actions',
              label: 'Actions',
              render: (row) => (
                <div className="flex gap-2">
                  <button className="btn-secondary !px-3 !py-2" disabled={row.status === 'approved'} onClick={() => decide(row._id, 'approved')}>Approve</button>
                  <button className="btn-secondary !px-3 !py-2" disabled={row.status === 'rejected'} onClick={() => decide(row._id, 'rejected')}>Reject</button>
                </div>
              )
            }
          ]}
          rows={registrations}
          empty="No registration requests yet"
        />
      </section>
    </div>
  );
}
