import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Welcome to GolfHeroes.');
      navigate('/dashboard/subscribe');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-950 py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-900/10 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black font-display text-lg">G</span>
            </div>
            <span className="font-display font-bold text-xl text-white">Golf<span className="text-green-400">Heroes</span></span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start playing with purpose today</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="input" placeholder="John Doe" required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="input" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className="input" placeholder="Min. 6 characters" required />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange}
              className="input" placeholder="Repeat password" required />
          </div>
          <p className="text-xs text-gray-600">By creating an account you agree to our Terms of Service and Privacy Policy.</p>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}