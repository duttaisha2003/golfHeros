import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import Spinner from '../../components/common/Spinner';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const loadUsers = () => {
    setLoading(true);
    adminAPI.users({ search, status, page, limit: 20 })
      .then(({ data }) => { setUsers(data.users); setTotal(data.total); setPages(data.pages); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, [search, status, page]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-500 text-sm">{total} total subscribers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input max-w-xs" placeholder="Search by name or email…" />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="input w-44">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="cancelled">Cancelled</option>
          <option value="lapsed">Lapsed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/60 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  {['Name','Email','Plan','Status','Charity %','Joined','Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-600">No users found.</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3 text-gray-400 capitalize">{u.subscription?.plan || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={u.subscription?.status === 'active' ? 'badge-active' : 'badge-inactive'}>
                        {u.subscription?.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.charityPercentage}%</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/users/${u._id}`} className="text-green-400 hover:text-green-300 text-xs font-medium">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
              <p className="text-gray-500 text-xs">Page {page} of {pages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-40">Previous</button>
                <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages} className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}