import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/40 group-hover:scale-105 transition-transform">
      <span className="text-white font-display font-black text-lg">G</span>
    </div>
    <span className="font-display font-bold text-xl text-white">Golf<span className="text-green-400">Heroes</span></span>
  </Link>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/charities', label: 'Charities' },
    { to: '/draws', label: 'Draws' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(l.to) ? 'bg-green-900/40 text-green-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm py-2">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white px-4 py-2 transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
              <span className={`block h-0.5 bg-current transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-4 space-y-2 animate-fade-in">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${isActive(l.to) ? 'bg-green-900/40 text-green-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-800 space-y-2">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800">
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-gray-800">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800">Sign In</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block btn-primary text-center text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}