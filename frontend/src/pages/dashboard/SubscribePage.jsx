import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '£9.99', period: '/month', desc: 'Cancel anytime', badge: null },
  { id: 'yearly',  label: 'Yearly',  price: '£89.99', period: '/year', desc: 'Save ~25%', badge: 'Best Value' },
];

export default function SubscribePage() {
  const { user, refreshUser } = useAuth();
  const [selected, setSelected] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const isActive = user?.subscription?.status === 'active';

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await userAPI.subscribe({ plan: selected });
      await refreshUser();
      toast.success('Subscription activated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-xl">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Subscription</h1>
        <p className="text-gray-500 text-sm mt-1">Choose your plan to unlock all features.</p>
      </div>

      {isActive ? (
        <div className="card border-green-800 bg-green-950/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">✅</span>
            <div>
              <p className="font-display font-semibold text-white">Subscription Active</p>
              <p className="text-green-400 text-sm capitalize">{user.subscription.plan} plan</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {user.subscription.endDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Renewal date</span>
                <span className="text-white">{new Date(user.subscription.endDate).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {PLANS.map((plan) => (
              <button key={plan.id} onClick={() => setSelected(plan.id)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${selected === plan.id ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-900 hover:border-gray-600'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-white">{plan.label}</span>
                      {plan.badge && <span className="badge-active text-xs">{plan.badge}</span>}
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5">{plan.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-bold text-xl text-white">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                </div>
                {selected === plan.id && (
                  <div className="mt-3 pt-3 border-t border-green-800 text-xs text-gray-500 space-y-1">
                    <p>✓ Full platform access</p>
                    <p>✓ Monthly draw participation</p>
                    <p>✓ Charity contribution (min. 10%)</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="card bg-gray-900/50">
            <p className="text-xs text-gray-600 mb-4">
              <strong className="text-gray-400">Note:</strong> Payment gateway integration coming soon. Clicking Subscribe below will activate your account for demo purposes.
            </p>
            <button onClick={handleSubscribe} disabled={loading} className="btn-primary w-full">
              {loading ? 'Activating…' : `Subscribe — ${PLANS.find(p => p.id === selected)?.price}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}