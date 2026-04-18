import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { drawAPI } from '../utils/api';
import Spinner from '../components/common/Spinner';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function DrawCard({ draw }) {
  return (
    <div className="card hover:border-green-800 transition-all animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-white">{MONTHS[draw.month-1]} {draw.year}</h3>
        <span className="badge-active">Published</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {draw.drawnNumbers.map((n, i) => (
          <span key={i} className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm">
            {n}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="bg-gray-800 rounded-xl p-2">
          <p className="text-gray-500">5-Match Pool</p>
          <p className="text-white font-semibold">£{draw.pool5Match}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-2">
          <p className="text-gray-500">4-Match Pool</p>
          <p className="text-white font-semibold">£{draw.pool4Match}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-2">
          <p className="text-gray-500">3-Match Pool</p>
          <p className="text-white font-semibold">£{draw.pool3Match}</p>
        </div>
      </div>
      <p className="text-gray-600 text-xs mt-3 text-center">{draw.winners.length} winner(s) this draw</p>
    </div>
  );
}

export default function DrawsPage() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    drawAPI.getAll().then(({ data }) => { setDraws(data.draws); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-white mb-3">Monthly Draws</h1>
            <p className="text-gray-500">Five numbers drawn every month. Match to win prize tiers.</p>
          </div>

          {/* How draws work */}
          <div className="card border-green-800 bg-green-950/20 mb-10">
            <h2 className="font-display font-semibold text-white mb-4">How Draws Work</h2>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              {[['🎰','Random Draw','Numbers drawn from a pool of 1–45'],['🧮','Algorithmic','Weighted by frequency of user scores'],['🎯','Match to Win','3, 4, or 5 number matches earn prizes']].map(([icon,t,d]) => (
                <div key={t} className="flex gap-3">
                  <span className="text-xl">{icon}</span>
                  <div><p className="text-white font-medium">{t}</p><p className="text-gray-500">{d}</p></div>
                </div>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : draws.length === 0 ? (
            <div className="text-center py-20 text-gray-600">No draws published yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {draws.map((d) => <DrawCard key={d._id} draw={d} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}