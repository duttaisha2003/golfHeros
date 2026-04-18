import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminNav = [
  { to: '/admin',           label: 'Dashboard',  icon: '📊', end: true },
  { to: '/admin/users',     label: 'Users',      icon: '👥' },
  { to: '/admin/draws',     label: 'Draws',      icon: '🎰' },
  { to: '/admin/charities', label: 'Charities',  icon: '💚' },
  { to: '/admin/winners',   label: 'Winners',    icon: '🏆' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col w-60 bg-gray-900 border-r border-gray-800 min-h-screen`}>
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">G</span>
          </div>
          <span className="font-display font-bold text-white text-sm">GolfHeroes <span className="text-green-400">Admin</span></span>
        </div>
        <p className="text-xs text-gray-600">Control Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {adminNav.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-green-900/50 text-green-400 border border-green-800/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
            }>
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-medium text-white">{user?.name}</p>
          <p className="text-xs text-green-400">Administrator</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-xl transition-colors">
          🚪 Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-60 z-10"><Sidebar mobile /></div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">☰</button>
          <span className="font-display font-bold text-white text-sm">Admin Panel</span>
        </div>
        <div className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}