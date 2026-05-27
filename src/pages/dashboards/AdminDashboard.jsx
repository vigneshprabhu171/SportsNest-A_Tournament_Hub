import { Ban, BarChart3, ClipboardCheck, Flag, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '../../components/ui/Badge';
import DataTable from '../../components/ui/DataTable';
import StatsCard from '../../components/ui/StatsCard';
import api from '../../services/api';
import { useAsync } from '../../hooks/useAsync';

export default function AdminDashboard() {
  const { data, reload } = useAsync(async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }, []);

  const moderate = async (id, action) => {
    try {
      await api.patch(`/admin/tournaments/${id}/${action}`);
      const labels = { approve: 'approved', reject: 'rejected', suspend: 'suspended', cancel: 'cancelled' };
      toast.success(`Tournament ${labels[action] || 'updated'}`);
      reload();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Moderation failed');
    }
  };

  const tournaments = data?.pendingTournaments || [];

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-black uppercase tracking-wide text-green-600 dark:text-green-400">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Platform moderation</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Approve tournaments, review reports, suspend problematic events, and monitor organizer activity.</p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Pending approvals" value={data?.stats?.pendingApprovals || 0} icon={ClipboardCheck} />
        <StatsCard label="Open reports" value={data?.stats?.openReports || 0} icon={Flag} />
        <StatsCard label="Suspended" value={data?.stats?.suspended || 0} icon={Ban} />
        <StatsCard label="Active organizers" value={data?.stats?.organizers || 0} icon={BarChart3} />
      </div>
      <DataTable
        columns={[
          { key: 'title', label: 'Tournament' },
          { key: 'sportType', label: 'Sport' },
          { key: 'organizer', label: 'Organizer', render: (row) => row.organizer?.name },
          { key: 'status', label: 'Status', render: (row) => <Badge tone="amber">{row.status.replace('_', ' ')}</Badge> },
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="flex gap-2">
                <button className="btn-secondary !px-3 !py-2" onClick={() => moderate(row._id, 'approve')}><ShieldCheck size={15} /> Approve</button>
                <button className="btn-secondary !px-3 !py-2" onClick={() => moderate(row._id, 'reject')}>Reject</button>
                <button className="btn-secondary !px-3 !py-2" onClick={() => moderate(row._id, 'suspend')}>Suspend</button>
              </div>
            )
          }
        ]}
        rows={tournaments}
        empty="No pending approvals"
      />
    </div>
  );
}
