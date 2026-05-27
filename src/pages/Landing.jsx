import { ShieldCheck, UserRound, UsersRound, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/brand/BrandLogo';
import { cn } from '../utils/cn';

export default function Landing() {
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowCard(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-white px-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.14),_transparent_34%),linear-gradient(135deg,_#ffffff,_#eef7f2)]" />

      <section className="relative flex min-h-[620px] w-full max-w-xl items-center justify-center">
        <div
          className={cn(
            'absolute flex flex-col items-center transition-all duration-700 ease-out',
            showCard ? '-translate-y-44 scale-75 opacity-0 sm:-translate-y-52' : 'translate-y-0 scale-100 opacity-100'
          )}
        >
          <BrandLogo imageClassName="h-72 w-auto max-w-[86vw] sm:h-96" />
        </div>

        <div
          className={cn(
            'glass-panel w-full max-w-md rounded-3xl p-6 text-center transition-all duration-700 ease-out sm:p-8',
            showCard ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-12 scale-95 opacity-0 pointer-events-none'
          )}
        >
          <BrandLogo className="justify-center" imageClassName="h-28 w-auto" />
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
            Welcome to SportsNest
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in or create an account to manage tournaments, registrations, and reports.
          </p>
          <div className="mt-7 grid gap-3">
            <Link className="btn-primary w-full" to="/login?role=player">
              <UserRound size={18} /> Player login
            </Link>
            <Link className="btn-secondary w-full" to="/login?role=organizer">
              <UsersRound size={18} /> Organizer login
            </Link>
            <Link className="btn-secondary w-full" to="/signup">
              <UserPlus size={18} /> Create account
            </Link>
            <Link className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-green-700" to="/admin/login">
              <ShieldCheck size={16} /> Admin portal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
