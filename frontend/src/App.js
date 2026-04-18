import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import HomePage       from './pages/HomePage';
import CharitiesPage  from './pages/CharitiesPage';
import DrawsPage      from './pages/DrawsPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';

// Dashboard pages
import DashboardLayout    from './components/dashboard/DashboardLayout';
import DashboardHome      from './pages/dashboard/DashboardHome';
import ScoresPage         from './pages/dashboard/ScoresPage';
import CharitySelectPage  from './pages/dashboard/CharitySelectPage';
import WinningsPage       from './pages/dashboard/WinningsPage';
import ProfilePage        from './pages/dashboard/ProfilePage';
import SubscribePage      from './pages/dashboard/SubscribePage';

// Admin pages
import AdminLayout        from './components/admin/AdminLayout';
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminUsers         from './pages/admin/AdminUsers';
import AdminUserDetail    from './pages/admin/AdminUserDetail';
import AdminDraws         from './pages/admin/AdminDraws';
import AdminCharities     from './pages/admin/AdminCharities';
import AdminWinners       from './pages/admin/AdminWinners';

// Route guards
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#fff', border: '1px solid #374151' }, success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } } }} />
        <Routes>
          {/* Public */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/charities"  element={<CharitiesPage />} />
          <Route path="/draws"      element={<DrawsPage />} />
          <Route path="/login"      element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register"   element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index           element={<DashboardHome />} />
            <Route path="scores"   element={<ScoresPage />} />
            <Route path="charity"  element={<CharitySelectPage />} />
            <Route path="winnings" element={<WinningsPage />} />
            <Route path="profile"  element={<ProfilePage />} />
            <Route path="subscribe" element={<SubscribePage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index              element={<AdminDashboard />} />
            <Route path="users"       element={<AdminUsers />} />
            <Route path="users/:id"   element={<AdminUserDetail />} />
            <Route path="draws"       element={<AdminDraws />} />
            <Route path="charities"   element={<AdminCharities />} />
            <Route path="winners"     element={<AdminWinners />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}