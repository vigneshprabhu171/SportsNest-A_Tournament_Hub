import {
  BarChart3,
  Bell,
  ClipboardCheck,
  Compass,
  LogOut,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "../brand/BrandLogo";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import { roles } from "../../utils/constants";

const baseLinks = [{ label: "Browse", to: "/tournaments", icon: Compass }];
const roleLinks = {
  [roles.PLAYER]: [
    { label: "Dashboard", to: "/user/dashboard", icon: BarChart3 },
    { label: "Notifications", to: "/notifications", icon: Bell },
  ],
  [roles.ORGANIZER]: [
    { label: "Organizer", to: "/organizer/dashboard", icon: BarChart3 },
    { label: "Create Event", to: "/organizer/tournaments/new", icon: Trophy },
    { label: "Notifications", to: "/notifications", icon: Bell },
  ],
  [roles.ADMIN]: [
    { label: "Admin", to: "/admin/dashboard", icon: ShieldCheck },
    { label: "Reports", to: "/reports", icon: ClipboardCheck },
  ],
};

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [...baseLinks, ...(roleLinks[user?.role] || [])];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  const content = (
    <aside className="flex h-full flex-col bg-white px-4 py-5 dark:bg-slate-950">
      <div className="mb-7 flex items-center justify-between">
        <NavLink to="/" className="flex items-center">
          <BrandLogo imageClassName="h-20 w-auto max-w-[210px] rounded-2xl bg-white p-1" />
        </NavLink>
        <button
          className="btn-secondary !p-2 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="space-y-1">
        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to + label}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition",
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900",
              )
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
        <p className="text-sm font-black text-green-900 dark:text-green-200">
          Ready for kickoff?
        </p>
        <p className="mt-1 text-xs text-green-700 dark:text-green-300">
          Track approvals, slots, registrations, and reports in one dashboard.
        </p>
      </div>

      {user ? (
        <button className="btn-secondary mt-4 w-full" onClick={handleLogout}>
          <LogOut size={17} /> Sign out
        </button>
      ) : (
        <NavLink className="btn-primary mt-4 w-full" to="/login">
          Sign in
        </NavLink>
      )}
    </aside>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 dark:border-slate-800 lg:block">
        {content}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="relative h-full w-72 border-r border-slate-200 dark:border-slate-800">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
