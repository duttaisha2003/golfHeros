import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm font-display">G</span>
              </div>
              <span className="font-display font-bold text-lg">Golf<span className="text-green-400">Heroes</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">Play. Win. Give. Every score you enter supports a cause that matters.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/charities', 'Charities'], ['/draws', 'Monthly Draws'], ['/register', 'Join Now']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-gray-500 hover:text-green-400 text-sm transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
                <li key={t}><span className="text-gray-500 text-sm cursor-pointer hover:text-gray-400 transition-colors">{t}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} GolfHeroes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}