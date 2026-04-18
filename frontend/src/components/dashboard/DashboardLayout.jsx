import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard',          label: 'Overview',     icon: '🏠' },
  { to: '/dashboard/scores',   label: 'My Scores',    icon: '⛳' },
  { to: '/dashboard/charity',  label: 'My Charity',   icon: '💚' },
  { to: '/dashboard/winnings', label: 'Winnings',     icon: '🏆' },
  { to: '/dashboard/subscribe',label: 'Subscription', icon: '💳' },
  { to: '/dashboard/profile',  label: 'Profile',      icon: '👤' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'block' : 'hidden lg:flex'} flex-col w-64 bg-gray-900 border-r border-gray-800 min-h-screen`}>
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm font-display">G</span>
          </div>
          <span className="font-display font-bold text-white">Golf<span className="text-green-400">Heroes</span></span>
        </div>
      </div>

      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-green-300 font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className={`text-xs font-medium ${user?.subscription?.status === 'active' ? 'text-green-400' : 'text-gray-500'}`}>
              {user?.subscription?.status === 'active' ? '✓ Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-green-900/50 text-green-400 border border-green-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
            }>
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <NavLink to="/" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-white rounded-xl hover:bg-gray-800 transition-colors">
          ← Back to site
        </NavLink>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 rounded-xl hover:bg-gray-800 transition-colors">
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-10">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
            <div className="space-y-1.5">
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
              <span className="block w-5 h-0.5 bg-current" />
            </div>
          </button>
          <span className="font-display font-bold text-white">Golf<span className="text-green-400">Heroes</span></span>
          <div className="w-9" />
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}