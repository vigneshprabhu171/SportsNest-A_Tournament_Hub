import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthFormCard from '../../components/forms/AuthFormCard';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form, true);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormCard eyebrow="Secure admin portal" title="Platform control room" subtitle="Admin access is isolated from player and organizer login.">
      <form className="space-y-4" onSubmit={submit}>
        <input className="field" type="email" placeholder="Admin email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <input className="field" type="password" placeholder="Admin password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Verifying...' : 'Enter admin dashboard'}</button>
      </form>
      <p className="mt-5 text-center text-sm"><Link className="font-bold text-slate-600 dark:text-slate-300" to="/login">Back to app login</Link></p>
    </AuthFormCard>
  );
}
