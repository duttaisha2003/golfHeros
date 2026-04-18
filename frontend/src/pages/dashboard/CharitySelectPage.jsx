import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { charityAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function CharitySelectPage() {
  const { user, refreshUser } = useAuth();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(user?.selectedCharity?._id || user?.selectedCharity || '');
  const [percentage, setPercentage] = useState(user?.charityPercentage || 10);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    charityAPI.getAll().then(({ data }) => { setCharities(data.charities); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!selected) return toast.error('Please select a charity');
    setSaving(true);
    try {
      await charityAPI.select({ charityId: selected, percentage });
      await refreshUser();
      toast.success('Charity preference saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">My Charity</h1>
        <p className="text-gray-500 text-sm mt-1">Choose a charity and set what percentage of your subscription to contribute.</p>
      </div>

      {/* Percentage slider */}
      <div className="card">
        <h2 className="font-display font-semibold text-white mb-1">Contribution Percentage</h2>
        <p className="text-gray-500 text-sm mb-4">Minimum 10%. Slide to increase your contribution.</p>
        <div className="flex items-center gap-4">
          <input type="range" min="10" max="100" step="5" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))}
            className="flex-1 accent-green-500 h-2 rounded-full" />
          <span className="font-display font-bold text-2xl text-green-400 w-16 text-right">{percentage}%</span>
        </div>
      </div>

      {/* Charity list */}
      <div className="card">
        <h2 className="font-display font-semibold text-white mb-4">Select a Charity</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {charities.map((c) => (
              <button key={c._id} onClick={() => setSelected(c._id)}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selected === c._id ? 'border-green-500 bg-green-900/20' : 'border-gray-700 hover:border-gray-600 bg-gray-800'}`}>
                <div className="w-10 h-10 bg-green-800/40 rounded-lg flex items-center justify-center text-xl flex-shrink-0">💚</div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm truncate">{c.name}</p>
                  <p className="text-gray-500 text-xs truncate">{c.description?.slice(0, 80)}…</p>
                </div>
                {selected === c._id && <span className="text-green-400 text-sm">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={saving || !selected} className="btn-primary w-full">
        {saving ? 'Saving…' : 'Save Charity Preference'}
      </button>
    </div>
  );
}