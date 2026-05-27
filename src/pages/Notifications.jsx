import { Bell } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import api from '../services/api';

export default function Notifications() {
  const { data } = useAsync(async () => {
    const response = await api.get('/notifications');
    return response.data.notifications;
  }, []);

  return (
    <div className="space-y-5">
      <section>
        <p className="text-sm font-black uppercase tracking-wide text-green-600 dark:text-green-400">Inbox</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Notifications</h1>
      </section>
      <div className="grid gap-3">
        {(data || []).map((notification) => (
          <article key={notification._id} className="glass-panel rounded-2xl p-4">
            <div className="flex gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"><Bell size={18} /></div>
              <div>
                <p className="font-black">{notification.title}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{notification.message}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
