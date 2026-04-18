import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', country: user?.country || '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPassword !== pwd.confirm) return toast.error('Passwords do not match');
    setSavingPwd(true);
    try {
      await authAPI.changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword });
      setPwd({ currentPassword: '', newPassword: '', confirm: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-lg">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information.</p>
      </div>

      {/* Avatar */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 bg-green-800 rounded-full flex items-center justify-center text-green-300 font-bold text-2xl">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-white">{user?.name}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <p className="text-xs text-green-400 mt-0.5 capitalize">{user?.subscription?.status} · {user?.subscription?.plan || 'No plan'}</p>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleProfile} className="card space-y-4">
        <h2 className="font-display font-semibold text-white">Personal Info</h2>
        <div>
          <label className="label">Full Name</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email Address</label>
          <input className="input bg-gray-700 cursor-not-allowed" value={user?.email} disabled />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44..." />
        </div>
        <div>
          <label className="label">Country</label>
          <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="United Kingdom" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      {/* Change password */}
      <form onSubmit={handlePassword} className="card space-y-4">
        <h2 className="font-display font-semibold text-white">Change Password</h2>
        <div>
          <label className="label">Current Password</label>
          <input type="password" className="input" value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} required />
        </div>
        <div>
          <label className="label">New Password</label>
          <input type="password" className="input" value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} required />
        </div>
        <div>
          <label className="label">Confirm New Password</label>
          <input type="password" className="input" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} required />
        </div>
        <button type="submit" disabled={savingPwd} className="btn-primary w-full">
          {savingPwd ? 'Updating…' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}