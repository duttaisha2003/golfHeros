import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import StatCard from '../../components/common/StatCard';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.stats().then(({ data }) => { setStats(data.stats); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Platform overview and key metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} color="blue" />
        <StatCard label="Active Subscribers" value={stats?.activeSubscribers ?? 0} color="green" />
        <StatCard label="Charities" value={stats?.totalCharities ?? 0} color="purple" />
        <StatCard label="Latest Prize Pool" value={stats?.latestDraw ? `£${stats.latestDraw.totalPool}` : '—'} color="yellow"
          sub={stats?.latestDraw ? `${stats.latestDraw.month}/${stats.latestDraw.year} · ${stats.latestDraw.winnersCount} winners` : null} />
      </div>

      {/* Charity contributions */}
      {stats?.charityData?.length > 0 && (
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Charity Distribution</h2>
          <div className="space-y-3">
            {stats.charityData.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{c._id ? 'Charity ID: ' + c._id : 'None selected'}</p>
                  <p className="text-gray-500 text-xs">{c.totalUsers} subscriber(s)</p>
                </div>
                <span className="text-green-400 text-sm font-medium">{c.avgPct?.toFixed(0)}% avg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}