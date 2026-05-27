export default function AuthFormCard({ eyebrow, title, subtitle, children }) {
  return (
    <section className="glass-panel w-full rounded-3xl p-6 sm:p-8">
      <p className="text-sm font-black uppercase tracking-wide text-green-600 dark:text-green-400">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
      <div className="mt-7">{children}</div>
    </section>
  );
}
