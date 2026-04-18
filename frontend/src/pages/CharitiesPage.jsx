import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { charityAPI } from '../utils/api';
import Spinner from '../components/common/Spinner';

function CharityCard({ charity }) {
  return (
    <div className="card hover:border-green-800 transition-all group animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-800/40 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
          💚
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-white">{charity.name}</h3>
            {charity.isFeatured && <span className="badge-active whitespace-nowrap">Featured</span>}
          </div>
          <p className="text-xs text-green-600 mb-2">{charity.category}</p>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{charity.description}</p>
          {charity.upcomingEvents?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-800">
              <p className="text-xs text-gray-600 font-medium mb-1">Upcoming Events</p>
              {charity.upcomingEvents.slice(0, 2).map((ev, i) => (
                <p key={i} className="text-xs text-gray-500">{ev.title} — {ev.location}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      charityAPI.getAll({ search }).then(({ data }) => { setCharities(data.charities); setLoading(false); }).catch(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-white mb-3">Our Charities</h1>
            <p className="text-gray-500">Every subscription supports a cause. Choose yours.</p>
          </div>

          <div className="mb-8">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              className="input max-w-md mx-auto block" placeholder="Search charities…" />
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Spinner size="lg" /></div>
          ) : charities.length === 0 ? (
            <div className="text-center py-20 text-gray-600">No charities found.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {charities.map((c) => <CharityCard key={c._id} charity={c} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}