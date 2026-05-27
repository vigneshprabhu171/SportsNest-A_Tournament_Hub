export default function StatsCard({ label, value, icon: Icon, hint }) {
  return (
    <div className="glass-panel rounded-2xl p-5 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</p>
          {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
        </div>
        {Icon && <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950"><Icon size={21} /></div>}
      </div>
    </div>
  );
}
