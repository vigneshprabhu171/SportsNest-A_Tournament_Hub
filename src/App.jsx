import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLogin from './pages/auth/AdminLogin';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import OrganizerDashboard from './pages/dashboards/OrganizerDashboard';
import UserDashboard from './pages/dashboards/UserDashboard';
import Landing from './pages/Landing';
import BrowseTournaments from './pages/tournaments/BrowseTournaments';
import CreateTournament from './pages/tournaments/CreateTournament';
import TournamentDetails from './pages/tournaments/TournamentDetails';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import { roles } from './utils/constants';

function ProtectedRoute({ children, allow }) {
  const { user, booting } = useAuth();

  if (booting) {
    return <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500 dark:bg-slate-950">Loading SportsNest...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to={user.role === roles.ADMIN ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
}

function DashboardRedirect() {
  const { user } = useAuth();
  if (user?.role === roles.ADMIN) return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === roles.ORGANIZER) return <Navigate to="/organizer/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
          <Route path="/tournaments" element={<BrowseTournaments />} />
          <Route path="/tournaments/:id" element={<TournamentDetails />} />
          <Route path="/user/dashboard" element={<ProtectedRoute allow={[roles.PLAYER]}><UserDashboard /></ProtectedRoute>} />
          <Route path="/organizer/dashboard" element={<ProtectedRoute allow={[roles.ORGANIZER]}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/organizer/tournaments/new" element={<ProtectedRoute allow={[roles.ORGANIZER]}><CreateTournament /></ProtectedRoute>} />
          <Route path="/organizer/tournaments/:id/edit" element={<ProtectedRoute allow={[roles.ORGANIZER]}><CreateTournament editMode /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute allow={[roles.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute allow={[roles.ADMIN]}><Reports /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
