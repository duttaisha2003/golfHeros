import React, { useEffect, useState } from 'react';
import { charityAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const EMPTY = { name: '', description: '', category: 'General', website: '', isFeatured: false };

export default function AdminCharities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = () => charityAPI.getAll().then(({ data }) => { setCharities(data.charities); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) await charityAPI.update(editId, form);
      else await charityAPI.create(form);
      toast.success(editId ? 'Charity updated!' : 'Charity created!');
      setForm(EMPTY); setEditId(null); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const startEdit = (c) => { setForm({ name: c.name, description: c.description, category: c.category, website: c.website || '', isFeatured: c.isFeatured }); setEditId(c._id); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this charity?')) return;
    try { await charityAPI.delete(id); toast.success('Charity removed'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-white">Charities</h1>
        <button onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(!showForm); }} className="btn-primary text-sm">
          {showForm ? '✕ Cancel' : '+ Add Charity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4 animate-slide-up">
          <h2 className="font-display font-semibold text-white">{editId ? 'Edit Charity' : 'New Charity'}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="label">Category</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input h-24 resize-none" required />
          </div>
          <div>
            <label className="label">Website (optional)</label>
            <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="input" placeholder="https://…" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-green-500" />
            <span className="text-gray-400 text-sm">Feature on homepage</span>
          </label>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save Charity'}</button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : charities.length === 0 ? (
        <div className="card text-center text-gray-500 py-10">No charities yet.</div>
      ) : (
        <div className="space-y-3">
          {charities.map((c) => (
            <div key={c._id} className="card flex items-start gap-4">
              <div className="w-10 h-10 bg-green-800/40 rounded-xl flex items-center justify-center text-xl flex-shrink-0">💚</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white">{c.name}</p>
                  {c.isFeatured && <span className="badge-active text-xs">Featured</span>}
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{c.category}</p>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{c.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(c)} className="text-xs px-3 py-1.5 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50">Edit</button>
                <button onClick={() => handleDelete(c._id)} className="text-xs px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}