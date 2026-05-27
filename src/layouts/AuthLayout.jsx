import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import BrandLogo from "../components/brand/BrandLogo";

export default function AuthLayout() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.14),_transparent_32%),linear-gradient(135deg,_#f8fafc,_#eef6ff)]">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-5 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex rounded-2xl border border-green-200 bg-white/80 px-4 py-3">
            <BrandLogo imageClassName="h-16 w-auto" />
          </div>
          <h1 className="max-w-xl text-5xl font-black tracking-tight text-slate-950">
            Run polished tournaments from approval to final whistle.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Players discover events, organizers organize tournaments and manage
            registrations, and admins keep the platform trusted.
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {["Live approvals", "Team entries", "Moderation"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/70 bg-white/70 p-4 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
        <Outlet />
      </div>
    </main>
  );
}
