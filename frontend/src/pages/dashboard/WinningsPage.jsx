import React, { useEffect, useState, useRef } from 'react';
import { winnerAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function WinningsPage() {
  const [winnings, setWinnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    winnerAPI.myWinnings().then(({ data }) => { setWinnings(data.winnings); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleUpload = async (win, file) => {
    const fd = new FormData();
    fd.append('image', file);
    setUploading(win._id);
    try {
      await winnerAPI.uploadProof(win.drawId, win._id, fd);
      toast.success('Proof uploaded! Awaiting admin review.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(null);
    }
  };

  const total = winnings.reduce((a, w) => a + (w.prizeAmount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">My Winnings</h1>
        <p className="text-gray-500 text-sm mt-1">View your prize history and upload verification proofs.</p>
      </div>

      {/* Total */}
      <div className="card border-green-800 bg-green-950/10">
        <p className="text-gray-500 text-sm">Total Winnings</p>
        <p className="font-display text-4xl font-black text-green-400">£{total.toFixed(2)}</p>
        <p className="text-gray-600 text-xs mt-1">Across {winnings.length} draw(s)</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : winnings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-gray-500 text-sm">No winnings yet. Keep entering scores!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {winnings.map((w) => (
            <div key={w._id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-display font-semibold text-white">{MONTHS[w.month-1]} {w.year}</p>
                  <p className="text-green-400 text-sm font-medium capitalize">{w.matchType}</p>
                </div>
                <p className="font-display font-bold text-xl text-white">£{w.prizeAmount?.toFixed(2)}</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {w.matchedNumbers?.map((n, i) => (
                  <span key={i} className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white text-xs font-bold">{n}</span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className={w.verificationStatus === 'approved' ? 'badge-active' : w.verificationStatus === 'rejected' ? 'text-red-400' : 'badge-pending'}>
                  Verification: {w.verificationStatus}
                </span>
                <span className={w.paymentStatus === 'paid' ? 'badge-paid' : 'badge-pending'}>
                  Payment: {w.paymentStatus}
                </span>
              </div>
              {w.verificationStatus === 'pending' && !w.proofImage && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <input type="file" ref={fileRef} accept="image/*" className="hidden"
                    onChange={(e) => e.target.files[0] && handleUpload(w, e.target.files[0])} />
                  <button onClick={() => fileRef.current.click()} disabled={uploading === w._id}
                    className="text-sm text-green-400 hover:text-green-300 font-medium">
                    {uploading === w._id ? 'Uploading…' : '📎 Upload Score Proof'}
                  </button>
                </div>
              )}
              {w.proofImage && <p className="text-xs text-gray-600 mt-2">✓ Proof submitted</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}