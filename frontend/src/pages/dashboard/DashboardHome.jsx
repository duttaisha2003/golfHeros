import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { scoreAPI, winnerAPI, drawAPI } from '../../utils/api';
import StatCard from '../../components/common/StatCard';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DashboardHome() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [currentDraw, setCurrentDraw] = useState(null);

  const isActive = user?.subscription?.status === 'active';

  useEffect(() => {
    if (isActive) {
      scoreAPI.getAll().then(({ data }) => setScores(data.scores)).catch(() => {});
      winnerAPI.myWinnings().then(({ data }) => setWinnings(data.winnings)).catch(() => {});
    }
    drawAPI.getCurrent().then(({ data }) => setCurrentDraw(data.draw)).catch(() => {});
  }, [isActive]);

  const totalWon = winnings.reduce((acc, w) => acc + (w.prizeAmount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Here's your GolfHeroes overview.</p>
      </div>

      {/* Subscription banner */}
      {!isActive && (
        <div className="card border-yellow-800 bg-yellow-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-yellow-300 font-semibold">No active subscription</p>
              <p className="text-gray-500 text-sm mt-0.5">Subscribe to enter scores, join draws, and support charities.</p>
            </div>
            <Link to="/dashboard/subscribe" className="btn-primary whitespace-nowrap text-sm">Subscribe Now</Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Subscription" value={user?.subscription?.status === 'active' ? 'Active' : 'Inactive'} color={isActive ? 'green' : 'yellow'} sub={user?.subscription?.plan || ''} />
        <StatCard label="Scores Logged" value={scores.length} color="blue" sub="out of 5 max" />
        <StatCard label="Total Won" value={`£${totalWon.toFixed(2)}`} color="purple" sub={`${winnings.length} draw(s)`} />
        <StatCard label="Charity %" value={`${user?.charityPercentage || 10}%`} color="green" sub={user?.selectedCharity?.name || 'None selected'} />
      </div>

      {/* Recent scores */}
      {isActive && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-white">My Scores</h2>
            <Link to="/dashboard/scores" className="text-green-400 text-sm hover:text-green-300">Manage →</Link>
          </div>
          {scores.length === 0 ? (
            <p className="text-gray-600 text-sm">No scores yet. <Link to="/dashboard/scores" className="text-green-400">Add your first score</Link></p>
          ) : (
            <div className="space-y-2">
              {scores.map((s) => (
                <div key={s._id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <span className="text-gray-400 text-sm">{new Date(s.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                  <span className="font-semibold text-white">{s.value} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current draw */}
      {currentDraw && (
        <div className="card border-green-800 bg-green-950/10">
          <h2 className="font-display font-semibold text-white mb-3">This Month's Draw</h2>
          <p className="text-gray-500 text-sm mb-3">{MONTHS[currentDraw.month-1]} {currentDraw.year} · {currentDraw.status}</p>
          {currentDraw.drawnNumbers?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentDraw.drawnNumbers.map((n, i) => (
                <span key={i} className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm">{n}</span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm italic">Numbers not yet drawn.</p>
          )}
          <p className="text-xs text-gray-600 mt-3">Total pool: £{currentDraw.totalPool}</p>
        </div>
      )}
    </div>
  );
}