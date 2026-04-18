import React, { useEffect, useState } from 'react';
import { scoreAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ value: '', date: '' });
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const loadScores = () => {
    scoreAPI.getAll().then(({ data }) => { setScores(data.scores); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { loadScores(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await scoreAPI.add({ value: Number(form.value), date: form.date });
      setScores(data.scores);
      setForm({ value: '', date: '' });
      toast.success('Score added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add score');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (id) => {
    if (!editValue || editValue < 1 || editValue > 45) return toast.error('Score must be 1–45');
    try {
      const { data } = await scoreAPI.edit(id, { value: Number(editValue) });
      setScores(data.scores);
      setEditId(null);
      toast.success('Score updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this score?')) return;
    try {
      const { data } = await scoreAPI.delete(id);
      setScores(data.scores);
      toast.success('Score deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">My Scores</h1>
        <p className="text-gray-500 text-sm mt-1">Enter your Stableford scores (1–45). Max 5 stored — newest replaces oldest.</p>
      </div>

      {/* Add form */}
      <div className="card">
        <h2 className="font-display font-semibold text-white mb-4">Add New Score</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="label">Score (1–45)</label>
            <input type="number" min="1" max="45" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="input" placeholder="e.g. 32" required />
          </div>
          <div className="flex-1">
            <label className="label">Date</label>
            <input type="date" max={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input" required />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
              {submitting ? 'Adding…' : 'Add Score'}
            </button>
          </div>
        </form>
      </div>

      {/* Score list */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Score History</h2>
          <span className="text-gray-600 text-sm">{scores.length}/5 scores</span>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : scores.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No scores logged yet. Add your first score above.</p>
        ) : (
          <div className="space-y-3">
            {scores.map((s) => (
              <div key={s._id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-xl">
                <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {s.value}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{s.value} Stableford points</p>
                  <p className="text-gray-500 text-xs">{new Date(s.date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</p>
                </div>

                {editId === s._id ? (
                  <div className="flex items-center gap-2">
                    <input type="number" min="1" max="45" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                      className="input w-20 text-center text-sm py-1.5" autoFocus />
                    <button onClick={() => handleEdit(s._id)} className="text-green-400 hover:text-green-300 text-sm font-medium">Save</button>
                    <button onClick={() => setEditId(null)} className="text-gray-500 hover:text-gray-400 text-sm">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditId(s._id); setEditValue(s.value); }}
                      className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-blue-900/20">Edit</button>
                    <button onClick={() => handleDelete(s._id)}
                      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded bg-red-900/20">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-xs text-gray-600 space-y-1">
        <p>• Only one score per date. Edit or delete existing scores to change them.</p>
        <p>• Your 5 most recent scores are used for draw matching.</p>
        <p>• Score range: 1–45 (Stableford format).</p>
      </div>
    </div>
  );
}