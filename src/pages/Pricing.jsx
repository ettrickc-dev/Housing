import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SUBSCRIPTION_PLANS, formatPrice, annualSavingsCents, ANCHOR,
} from '../lib/pricing.js';
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

  const savings = annualSavingsCents();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-center text-3xl font-bold text-navy">Simple, honest pricing</h1>
      <p className="mx-auto mt-2 max-w-2xl text-center text-gray-600">
        An attorney charges <strong>${ANCHOR.attorneyMin}+</strong> and document-prep
        services charge up to <strong>${ANCHOR.serviceMax}</strong> for the same paperwork.
        Prepare yours here for a fraction of that — and preview it free before you pay.
      </p>

      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}

      <div className="mt-8 grid items-start gap-5 sm:grid-cols-3">
        {/* Annual — hero / most popular */}
        <div className="order-1 rounded-2xl border-2 border-accent bg-white p-6 shadow-md sm:order-2 sm:-mt-2">
          <div className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            MOST POPULAR · BEST VALUE
          </div>
          <h2 className="mt-3 font-semibold text-navy">Annual — unlimited</h2>
          <p className="mt-1 text-3xl font-bold text-navy">
            {formatPrice(SUBSCRIPTION_PLANS.annual.amountCents)}
            <span className="text-sm font-normal text-gray-500">/year</span>
          </p>
          <p className="mt-1 text-sm font-medium text-green-700">
            Save {formatPrice(savings)} vs. monthly
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Unlimited documents, all updates, and priority law-change alerts.
          </p>
          <button
            onClick={() => subscribe('annual')}
            disabled={busy === 'annual'}
            className="mt-4 w-full rounded-md bg-accent px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {busy === 'annual' ? 'Starting…' : 'Get unlimited (annual)'}
          </button>
        </div>

        {/* Monthly */}
        <div className="order-2 rounded-2xl border border-gray-200 bg-white p-6 sm:order-1">
          <h2 className="font-semibold text-navy">Monthly — unlimited</h2>
          <p className="mt-1 text-3xl font-bold text-navy">
            {formatPrice(SUBSCRIPTION_PLANS.monthly.amountCents)}
            <span className="text-sm font-normal text-gray-500">/month</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">Cancel anytime.</p>
          <p className="mt-2 text-sm text-gray-600">
            Unlimited documents — ideal if you have more than one to file.
          </p>
          <button
            onClick={() => subscribe('monthly')}
            disabled={busy === 'monthly'}
            className="mt-4 w-full rounded-md border border-accent px-4 py-2.5 font-medium text-accent hover:bg-blue-50 disabled:opacity-60"
          >
            {busy === 'monthly' ? 'Starting…' : 'Subscribe monthly'}
          </button>
        </div>

        {/* Pay per document */}
        <div className="order-3 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-navy">Pay per document</h2>
          <p className="mt-1 text-3xl font-bold text-navy">
            $25<span className="text-sm font-normal text-gray-500">+</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">One document, one time.</p>
          <p className="mt-2 text-sm text-gray-600">
            Just need a single form? Build it free and pay only to download the final copy.
          </p>
          <Link
            to="/start"
            className="mt-4 inline-block w-full rounded-md border border-gray-300 px-4 py-2.5 text-center font-medium text-navy hover:bg-gray-50"
          >
            Start one document
          </Link>
        </div>
      </div>

      <ul className="mx-auto mt-10 max-w-2xl space-y-2 text-sm text-gray-700">
        <Check>Free to build and preview every document — pay only when you download.</Check>
        <Check>Plain-English questions, examples, and your deadlines calculated for you.</Check>
        <Check>A filing &amp; service instruction sheet attached to every document.</Check>
        <Check>Your info and documents saved to your account to reuse and come back to.</Check>
      </ul>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-gray-400">
        Subscriptions renew automatically until you cancel; cancel anytime from your
        Account page. Per-document purchases are one-time. Prices in USD.
      </p>

      <div className="mt-8">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}

function Check({ children }) {
  return (
    <li className="flex gap-2">
      <span className="text-green-600">✓</span>
      <span>{children}</span>
    </li>
  );
}
