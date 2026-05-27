import { UserRound, UsersRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthFormCard from "../../components/forms/AuthFormCard";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "player",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      navigate(
        user.role === "organizer" ? "/organizer/dashboard" : "/user/dashboard",
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  const roleChoice = (role, Icon, title, body) => (
    <button
      type="button"
      onClick={() => setForm({ ...form, role })}
      className={cn(
        "rounded-2xl border p-4 text-left transition hover:-translate-y-0.5",
        form.role === role
          ? "border-green-500 bg-green-50 dark:bg-green-950/40"
          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950",
      )}
    >
      <Icon className="mb-3 text-green-600 dark:text-green-300" size={22} />
      <p className="font-black capitalize">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{body}</p>
    </button>
  );

  return (
    <AuthFormCard
      eyebrow="Create account"
      title="Choose your lane"
      subtitle="Register as a player or organizer."
    >
      <form className="space-y-4" onSubmit={submit}>
        <div className="grid gap-3 sm:grid-cols-2">
          {roleChoice(
            "player",
            UserRound,
            "Player",
            "Browse, save, register, and track status.",
          )}
          {roleChoice(
            "organizer",
            UsersRound,
            "Organizer",
            "Create tournaments and manage participants.",
          )}
        </div>
        <input
          className="field"
          placeholder="Full name"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
        <input
          className="field"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          required
        />
        <input
          className="field"
          type="password"
          minLength={8}
          placeholder="Password"
          value={form.password}
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
          required
        />
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link
          className="font-bold text-green-700 dark:text-green-300"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </AuthFormCard>
  );
}
