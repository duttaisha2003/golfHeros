import React, { useEffect, useState } from 'react';
import { winnerAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminWinners() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => winnerAPI.adminAll().then(({ data }) => { setWinners(data.winners); setLoading(false); }).catch(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleVerify = async (drawId, winnerId, status) => {
    try {
      await winnerAPI.verify(drawId, winnerId, { status });
      toast.success(`Marked as ${status}`);
      load();
    } catch { toast.error('Failed'); }
  };

  const handlePay = async (drawId, winnerId) => {
    try {
      await winnerAPI.markPaid(drawId, winnerId);
      toast.success('Marked as paid');
      load();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-white">Winners Management</h1>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : winners.length === 0 ? (
        <div className="card text-center py-16 text-gray-500">No winners yet across any draw.</div>
      ) : (
        <div className="space-y-4">
          {winners.map((w, i) => (
            <div key={i} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div>
                  <p className="font-display font-semibold text-white">{w.user?.name || 'Unknown'}</p>
                  <p className="text-gray-500 text-xs">{w.user?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold font-display">£{w.prizeAmount?.toFixed(2)}</p>
                  <p className="text-gray-500 text-xs capitalize">{w.matchType} · {MONTHS[(w.month||1)-1]} {w.year}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                <span className={w.verificationStatus === 'approved' ? 'badge-active' : w.verificationStatus === 'rejected' ? 'text-red-400 bg-red-900/20 px-2 py-0.5 rounded-full' : 'badge-pending'}>
                  Verification: {w.verificationStatus}
                </span>
                <span className={w.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}>
                  Payment: {w.paymentStatus}
                </span>
              </div>

              {w.proofImage && (
                <a href={`http://localhost:5000${w.proofImage}`} target="_blank" rel="noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 block mb-3">📎 View Proof</a>
              )}

              <div className="flex flex-wrap gap-2">
                {w.verificationStatus === 'pending' && (
                  <>
                    <button onClick={() => handleVerify(w.drawId, w._id, 'approved')} className="text-xs px-3 py-1.5 bg-green-900/40 text-green-400 rounded-lg hover:bg-green-900/60">✓ Approve</button>
                    <button onClick={() => handleVerify(w.drawId, w._id, 'rejected')} className="text-xs px-3 py-1.5 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50">✕ Reject</button>
                  </>
                )}
                {w.verificationStatus === 'approved' && w.paymentStatus === 'pending' && (
                  <button onClick={() => handlePay(w.drawId, w._id)} className="text-xs px-3 py-1.5 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50">💳 Mark Paid</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}