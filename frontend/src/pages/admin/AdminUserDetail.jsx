import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subForm, setSubForm] = useState({ status: '', plan: '', endDate: '' });
  const [saving, setSaving] = useState(false);
  const [editScore, setEditScore] = useState(null);
  const [editVal, setEditVal] = useState('');

  useEffect(() => {
    adminAPI.userById(id).then(({ data }) => {
      setUser(data.user); setScores(data.scores);
      setSubForm({ status: data.user.subscription?.status || '', plan: data.user.subscription?.plan || '', endDate: data.user.subscription?.endDate ? data.user.subscription.endDate.split('T')[0] : '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleSubscription = async () => {
    setSaving(true);
    try {
      await adminAPI.updateSubscription(id, subForm);
      toast.success('Subscription updated');
    } catch { toast.error('Failed to update'); }
    finally { setSaving(false); }
  };

  const handleScoreEdit = async (entryId) => {
    try {
      const { data } = await adminAPI.editScore(id, { entryId, value: Number(editVal) });
      setScores(data.scores);
      setEditScore(null);
      toast.success('Score updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const toggleActive = async () => {
    try {
      await adminAPI.updateUser(id, { isActive: !user.isActive });
      setUser({ ...user, isActive: !user.isActive });
      toast.success('Account status updated');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!user) return <div className="text-gray-500 text-center py-20">User not found.</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/users')} className="text-gray-400 hover:text-white text-sm">← Back</button>
        <h1 className="font-display text-xl font-bold text-white">{user.name}</h1>
      </div>

      {/* User info */}
      <div className="card grid sm:grid-cols-2 gap-4 text-sm">
        {[['Email', user.email], ['Phone', user.phone || '—'], ['Country', user.country || '—'], ['Role', user.role], ['Charity %', user.charityPercentage + '%'], ['Joined', new Date(user.createdAt).toLocaleDateString('en-GB')]].map(([k,v]) => (
          <div key={k}><p className="text-gray-500 text-xs">{k}</p><p className="text-white font-medium mt-0.5">{v}</p></div>
        ))}
        <div className="sm:col-span-2 flex items-center justify-between pt-2 border-t border-gray-800">
          <div>
            <p className="text-gray-500 text-xs">Account Status</p>
            <p className={`font-medium mt-0.5 ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>{user.isActive ? 'Active' : 'Deactivated'}</p>
          </div>
          <button onClick={toggleActive} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${user.isActive ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'}`}>
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Subscription manager */}
      <div className="card space-y-4">
        <h2 className="font-display font-semibold text-white">Manage Subscription</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Status</label>
            <select value={subForm.status} onChange={(e) => setSubForm({ ...subForm, status: e.target.value })} className="input">
              {['active','inactive','cancelled','lapsed'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Plan</label>
            <select value={subForm.plan} onChange={(e) => setSubForm({ ...subForm, plan: e.target.value })} className="input">
              <option value="">— None —</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div>
            <label className="label">End Date</label>
            <input type="date" value={subForm.endDate} onChange={(e) => setSubForm({ ...subForm, endDate: e.target.value })} className="input" />
          </div>
        </div>
        <button onClick={handleSubscription} disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Update Subscription'}
        </button>
      </div>

      {/* Scores */}
      <div className="card">
        <h2 className="font-display font-semibold text-white mb-4">Golf Scores ({scores.length}/5)</h2>
        {scores.length === 0 ? (
          <p className="text-gray-600 text-sm">No scores logged.</p>
        ) : (
          <div className="space-y-2">
            {scores.map((s) => (
              <div key={s._id} className="flex items-center gap-4 p-3 bg-gray-800 rounded-xl">
                <span className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">{s.value}</span>
                <span className="text-gray-400 text-sm flex-1">{new Date(s.date).toLocaleDateString('en-GB')}</span>
                {editScore === s._id ? (
                  <div className="flex gap-2">
                    <input type="number" min="1" max="45" value={editVal} onChange={e => setEditVal(e.target.value)} className="input w-20 py-1 text-sm" autoFocus />
                    <button onClick={() => handleScoreEdit(s._id)} className="text-green-400 text-sm hover:text-green-300">Save</button>
                    <button onClick={() => setEditScore(null)} className="text-gray-500 text-sm">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => { setEditScore(s._id); setEditVal(s.value); }} className="text-xs text-blue-400 px-2 py-1 bg-blue-900/20 rounded hover:bg-blue-900/40">Edit</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}