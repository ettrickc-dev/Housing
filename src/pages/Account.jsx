import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { getProfile } from '../lib/profile.js';
import { hasActiveSubscription, SUBSCRIPTION_PLANS } from '../lib/pricing.js';
import { createPortalSession } from '../lib/api.js';
import Disclaimer from '../components/Disclaimer.jsx';

export default function Account() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const justSubscribed = params.get('sub') === 'success';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfile(user.id).then((p) => { setProfile(p); setLoading(false); }).catch(() => setLoading(false));
  }, [user]);

  async function manage() {
    setBusy(true);
    setError('');
    try {
      const { url } = await createPortalSession();
      window.location.href = url;
    } catch (e) {
      setError(e.message || 'Could not open the billing portal.');
      setBusy(false);
    }
  }

  if (loading) return <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">Loading…</p>;

  const active = hasActiveSubscription(profile);
  const planLabel = profile?.subscription_plan
    ? SUBSCRIPTION_PLANS[profile.subscription_plan]?.label || profile.subscription_plan
    : null;

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <h1 className="text-2xl font-bold text-navy">Account &amp; subscription</h1>
      <p className="mt-1 text-sm text-gray-600">{user.email}</p>

      {justSubscribed && (
        <div className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
          Thanks for subscribing! Your plan activates as soon as payment is confirmed.
          If it doesn't show below yet, refresh in a moment.
        </div>
      )}

      <section className="mt-6 rounded-lg border border-gray-200 p-5">
        {active ? (
          <>
            <p className="text-lg font-semibold text-navy">
              {planLabel} plan — <span className="text-green-700">active</span>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Unlimited filing-ready documents (no per-document charge).
              {profile.subscription_period_end && (
                <> Renews/ends {new Date(profile.subscription_period_end).toLocaleDateString()}.</>
              )}
            </p>
            <button
              onClick={manage}
              disabled={busy}
              className="mt-4 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-navy hover:bg-gray-50 disabled:opacity-60"
            >
              {busy ? 'Opening…' : 'Manage / cancel subscription'}
            </button>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-navy">No active subscription</p>
            <p className="mt-1 text-sm text-gray-600">
              You pay per document. Subscribe for unlimited documents.
            </p>
            <Link
              to="/pricing"
              className="mt-4 inline-block rounded-md bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View plans
            </Link>
          </>
        )}
      </section>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}
