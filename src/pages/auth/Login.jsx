import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthFormCard from '../../components/forms/AuthFormCard';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const roleLabel = role === 'organizer' ? 'Organizer' : role === 'player' ? 'Player' : 'Player and organizer';

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === 'organizer' ? '/organizer/dashboard' : '/user/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormCard eyebrow={`${roleLabel} login`} title="Welcome back" subtitle="Sign in to manage registrations, tournaments, saves, and notifications.">
      <form className="space-y-4" onSubmit={submit}>
        <input className="field" type="email" placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <input className="field" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm">
        <Link className="font-bold text-green-700 dark:text-green-300" to="/signup">Create account</Link>
        <Link className="font-bold text-slate-600 dark:text-slate-300" to="/admin/login">Admin login</Link>
      </div>
    </AuthFormCard>
  );
}
