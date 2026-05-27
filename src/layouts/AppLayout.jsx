import { Menu, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { theme, setTheme, toggleTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              className="btn-secondary !p-2 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            {/* <div className="hidden flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 sm:flex">
              <Search size={18} />
              Search tournaments, organizers, sports
            </div> */}
            <button
              className="btn-secondary ml-auto !p-2"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            {user && (
              <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 sm:flex">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-green-100 font-bold text-green-700 dark:bg-green-950 dark:text-green-300">
                  {user.name?.[0] || "S"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {user.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
