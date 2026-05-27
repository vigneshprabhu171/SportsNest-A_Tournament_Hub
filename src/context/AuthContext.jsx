import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sportsnest_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('sportsnest_token'));
  const [booting, setBooting] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setBooting(false);
      return;
    }

    authService.me()
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('sportsnest_user', JSON.stringify(data.user));
      })
      .catch(() => {
        setUser(null);
        setToken(null);
      })
      .finally(() => setBooting(false));
  }, [token]);

  const persistSession = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('sportsnest_user', JSON.stringify(data.user));
    localStorage.setItem('sportsnest_token', data.token);
  };

  const login = async (payload, admin = false) => {
    const { data } = admin ? await authService.adminLogin(payload) : await authService.login(payload);
    persistSession(data);
    toast.success(`Welcome back, ${data.user.name}`);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await authService.register(payload);
    persistSession(data);
    toast.success('Account created');
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sportsnest_user');
    localStorage.removeItem('sportsnest_token');
    toast.success('Signed out');
  };

  const value = useMemo(() => ({ user, token, booting, login, register, logout, isAuthenticated: Boolean(token) }), [user, token, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
