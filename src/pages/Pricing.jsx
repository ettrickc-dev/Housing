import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SUBSCRIPTION_PLANS, formatPrice } from '../lib/pricing.js';
import { PRICING } from '../lib/constants.js';
import { createSubscriptionSession } from '../lib/api.js';
import Disclaimer from '../components/Disclaimer.jsx';

export default function Pricing() {
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  async function subscribe(planKey) {
    setBusy(planKey);
    setError('');
    try {
      const { url } = await createSubscriptionSession(planKey);
      window.location.href = url;
    } catch (e) {
      setError(e.message || 'Could not start checkout.');
      setBusy('');
    }
  }

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <h1 className="text-2xl font-bold text-navy">Pricing</h1>
      <p className="mt-1 text-sm text-gray-600">
        Create an account and prepare documents for free. Pay only when you unlock a
        filing-ready copy — or subscribe for unlimited documents.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {/* Pay per document */}
        <div className="rounded-lg border border-gray-200 p-5">
          <h2 className="font-semibold text-navy">Pay per document</h2>
          <p className="mt-1 text-2xl font-bold text-navy">
            {formatPrice(PRICING.perDocument.min * 100)}+
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {formatPrice(PRICING.perDocument.min * 100)}–{formatPrice(PRICING.perDocument.max * 100)} per
            document, depending on complexity.
          </p>
          <Link to="/start" className="mt-4 inline-block text-accent underline">
            Start a document
          </Link>
        </div>

        {/* Monthly */}
        <PlanCard
          plan={SUBSCRIPTION_PLANS.monthly}
          busy={busy === 'monthly'}
          onSubscribe={() => subscribe('monthly')}
        />
        {/* Annual */}
        <PlanCard
          plan={SUBSCRIPTION_PLANS.annual}
          highlight
          busy={busy === 'annual'}
          onSubscribe={() => subscribe('annual')}
        />
      </div>

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}

function PlanCard({ plan, highlight, busy, onSubscribe }) {
  return (
    <div className={`rounded-lg border p-5 ${highlight ? 'border-accent ring-1 ring-accent' : 'border-gray-200'}`}>
      <h2 className="font-semibold text-navy">{plan.label} {highlight && <span className="text-xs text-accent">· best value</span>}</h2>
      <p className="mt-1 text-2xl font-bold text-navy">
        {formatPrice(plan.amountCents)}
        <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
      </p>
      <p className="mt-1 text-sm text-gray-600">{plan.blurb}</p>
      <button
        onClick={onSubscribe}
        disabled={busy}
        className="mt-4 w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {busy ? 'Starting…' : `Subscribe ${plan.label.toLowerCase()}`}
      </button>
    </div>
  );
}
