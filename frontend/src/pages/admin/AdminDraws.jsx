import React, { useEffect, useState } from 'react';
import { drawAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDraws() {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ month: new Date().getMonth()+1, year: new Date().getFullYear(), drawType: 'random' });

  const load = () => drawAPI.adminGetAll().then(({ data }) => { setDraws(data.draws); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await drawAPI.create(form);
      toast.success('Draw created!');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create draw'); }
    finally { setCreating(false); }
  };

  const handleSimulate = async (id) => {
    try {
      await drawAPI.simulate(id);
      toast.success('Simulation complete!');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Simulation failed'); }
  };

  const handlePublish = async (id) => {
    if (!window.confirm('Publish this draw? This cannot be undone.')) return;
    try {
      await drawAPI.publish(id);
      toast.success('Draw published!');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Publish failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-white">Draw Management</h1>

      {/* Create draw */}
      <div className="card">
        <h2 className="font-display font-semibold text-white mb-4">Create Draw</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="label">Month</label>
            <select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} className="input w-36">
              {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Year</label>
            <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="input w-28" />
          </div>
          <div>
            <label className="label">Draw Type</label>
            <select value={form.drawType} onChange={(e) => setForm({ ...form, drawType: e.target.value })} className="input w-40">
              <option value="random">Random</option>
              <option value="algorithmic">Algorithmic</option>
            </select>
          </div>
          <button onClick={handleCreate} disabled={creating} className="btn-primary">
            {creating ? 'Creating…' : 'Create Draw'}
          </button>
        </div>
      </div>

      {/* Draw list */}
      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : draws.length === 0 ? (
        <div className="card text-center text-gray-500 py-10">No draws yet.</div>
      ) : (
        <div className="space-y-4">
          {draws.map((d) => (
            <div key={d._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display font-semibold text-white">{MONTHS[d.month-1]} {d.year}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${d.status === 'published' ? 'bg-green-900 text-green-300' : d.status === 'simulation' ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-700 text-gray-400'}`}>
                      {d.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">Type: {d.drawType} · Subscribers: {d.activeSubscribersCount} · Pool: £{d.totalPool}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {d.status === 'draft' && <button onClick={() => handleSimulate(d._id)} className="btn-secondary text-sm py-1.5">🎲 Simulate</button>}
                  {d.status === 'simulation' && (
                    <>
                      <button onClick={() => handleSimulate(d._id)} className="text-xs px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700">Re-simulate</button>
                      <button onClick={() => handlePublish(d._id)} className="btn-primary text-sm py-1.5">📢 Publish</button>
                    </>
                  )}
                </div>
              </div>

              {d.drawnNumbers?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <p className="text-xs text-gray-500 mb-2">Drawn Numbers</p>
                  <div className="flex flex-wrap gap-2">
                    {d.drawnNumbers.map((n, i) => (
                      <span key={i} className="w-9 h-9 bg-green-700 rounded-full flex items-center justify-center text-white text-sm font-bold">{n}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{d.winners?.length || 0} winner(s) found</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}