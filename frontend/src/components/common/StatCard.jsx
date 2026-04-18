import React from 'react';

export default function StatCard({ label, value, icon: Icon, color = 'green', sub }) {
  const colors = {
    green: 'bg-green-900/30 text-green-400 border-green-800',
    blue:  'bg-blue-900/30 text-blue-400 border-blue-800',
    yellow:'bg-yellow-900/30 text-yellow-400 border-yellow-800',
    purple:'bg-purple-900/30 text-purple-400 border-purple-800',
  };
  return (
    <div className="card flex items-start gap-4 animate-slide-up">
      {Icon && (
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-display font-bold text-white mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}