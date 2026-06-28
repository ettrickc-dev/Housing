import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext.jsx';
import {
  getStatutes, markVerified, setFlag, saveNotes,
  getLawLog, getNyscefProcedures, saveNyscefProcedures,
} from '../lib/admin.js';
import { fetchPricing, setPriceCents } from '../lib/pricingDb.js';
import { DOCUMENTS } from '../documents/registry.jsx';
import { DOC_PRICES_CENTS, DEFAULT_PRICE_CENTS, SUBSCRIPTION_PLANS } from '../lib/pricing.js';

export default function AdminDashboard() {
  const { user } = useAuth();
  const adminEmail = user.email;

  const [statutes, setStatutes] = useState([]);
  const [log, setLog] = useState([]);
  const [nyscef, setNyscef] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function reload() {
    const [s, l, n] = await Promise.all([getStatutes(), getLawLog(), getNyscefProcedures()]);
    setStatutes(s);
    setLog(l);
    setNyscef(n?.notes || '');
    setLoading(false);
  }
  useEffect(() => { reload().catch((e) => { setErr(e.message); setLoading(false); }); }, []);

  async function act(fn) {
    setErr('');
    try { await fn(); await reload(); }
    catch (e) { setErr(e.message); }
  }

  if (loading) return <p className="mx-auto max-w-prose px-4 py-16 text-gray-500">Loading…</p>;

  const flaggedCount = statutes.filter((s) => s.flagged_for_review).length;
  const unverifiedCount = statutes.filter((s) => !s.last_verified_date).length;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-navy">Admin — Law Review</h1>
      <p className="mt-1 text-sm text-gray-600">
        Verify statutes, flag changes (which raises a banner on affected documents),
        and keep the platform law-review date current.
      </p>
      <div className="mt-3 flex gap-3 text-sm">
        <span className="rounded bg-panel px-3 py-1">{statutes.length} statutes</span>
        <span className="rounded bg-warnbanner px-3 py-1">{flaggedCount} flagged</span>
        <span className="rounded bg-amber-50 px-3 py-1">{unverifiedCount} never verified</span>
      </div>

      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

      {/* Statute catalog */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy">Statute catalog</h2>
        <div className="mt-3 space-y-3">
          {statutes.map((s) => (
            <StatuteRow key={s.id} statute={s} adminEmail={adminEmail} onAct={act} />
          ))}
        </div>
      </section>

      {/* NYSCEF Procedures */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy">NYSCEF procedures</h2>
        <p className="mt-1 text-sm text-gray-600">
          Maintained notes on current e-filing procedures (shown in the admin record and
          referenced when documents are prepared).
        </p>
        <textarea
          rows={5}
          value={nyscef}
          onChange={(e) => setNyscef(e.target.value)}
          className="input mt-3"
          placeholder="Current NYSCEF requirements, which case types e-file, account steps, etc."
        />
        <button
          onClick={() => act(() => saveNyscefProcedures(nyscef, adminEmail))}
          className="mt-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save NYSCEF procedures
        </button>
      </section>

      {/* Pricing */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy">Pricing</h2>
        <p className="mt-1 text-sm text-gray-600">
          Set what each document and subscription costs. Changes take effect immediately —
          no redeploy needed.
        </p>
        <PricingAdmin />
      </section>

      {/* Law update log */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy">Law update log</h2>
        {log.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No entries yet.</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm">
            {log.map((e) => (
              <li key={e.id} className="rounded border border-gray-100 px-3 py-2">
                <span className="font-medium capitalize">{e.action}</span>
                {e.citation ? ` — ${e.citation}` : ''}
                {e.note ? ` · ${e.note}` : ''}
                <span className="ml-2 text-xs text-gray-400">
                  {new Date(e.created_at).toLocaleString()}
                  {e.admin_email ? ` · ${e.admin_email}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function PricingAdmin() {
  const [rows, setRows] = useState(null);
  const [savedKey, setSavedKey] = useState('');
  const [err, setErr] = useState('');

  async function load() {
    const ov = await fetchPricing();
    const docs = Object.entries(DOCUMENTS).map(([key, cfg]) => ({
      key, label: cfg.title,
      cents: ov[key] ?? DOC_PRICES_CENTS[key] ?? DEFAULT_PRICE_CENTS,
    }));
    setRows([
      ...docs,
      { key: 'sub_monthly', label: 'Subscription — Monthly', cents: ov.sub_monthly ?? SUBSCRIPTION_PLANS.monthly.amountCents },
      { key: 'sub_annual', label: 'Subscription — Annual', cents: ov.sub_annual ?? SUBSCRIPTION_PLANS.annual.amountCents },
    ]);
  }
  useEffect(() => { load(); }, []);

  async function save(key, dollars) {
    setErr('');
    const cents = Math.round(parseFloat(dollars) * 100);
    if (Number.isNaN(cents) || cents < 0) { setErr('Enter a valid price.'); return; }
    try {
      await setPriceCents(key, cents);
      setSavedKey(key);
      setTimeout(() => setSavedKey(''), 1500);
      load();
    } catch (e) { setErr(e.message); }
  }

  if (!rows) return <p className="mt-2 text-sm text-gray-500">Loading…</p>;
  return (
    <div className="mt-3 space-y-2">
      {err && <p className="text-sm text-red-600">{err}</p>}
      {rows.map((r) => (
        <PriceRow key={r.key} row={r} onSave={save} saved={savedKey === r.key} />
      ))}
    </div>
  );
}

function PriceRow({ row, onSave, saved }) {
  const [val, setVal] = useState((row.cents / 100).toFixed(2));
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-gray-200 p-2 text-sm">
      <span className="text-navy">{row.label}</span>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">$</span>
        <input
          type="number" step="0.01" min="0"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-24 rounded border border-gray-300 px-2 py-1"
        />
        <button
          onClick={() => onSave(row.key, val)}
          className="rounded bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          Save
        </button>
        {saved && <span className="text-xs text-green-700">✓</span>}
      </div>
    </div>
  );
}

function StatuteRow({ statute, adminEmail, onAct }) {
  const [notes, setNotes] = useState(statute.notes || '');
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-lg border p-4 ${statute.flagged_for_review ? 'border-deadline bg-amber-50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-navy">
            {statute.citation}
            {statute.flagged_for_review && (
              <span className="ml-2 rounded bg-deadline px-2 py-0.5 text-xs text-white">FLAGGED</span>
            )}
          </p>
          <p className="text-sm text-gray-600">{statute.name}</p>
          <p className="mt-1 text-xs text-gray-500">
            {statute.category || 'Uncategorized'} ·{' '}
            {statute.last_verified_date
              ? `verified ${statute.last_verified_date}`
              : 'never verified'}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button
            onClick={() => onAct(() => markVerified(statute, adminEmail))}
            className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
          >
            Mark verified today
          </button>
          <button
            onClick={() => onAct(() => setFlag(statute, !statute.flagged_for_review, adminEmail))}
            className="rounded-md border border-deadline px-3 py-1 text-xs font-medium text-deadline hover:bg-amber-100"
          >
            {statute.flagged_for_review ? 'Clear flag' : 'Flag for review'}
          </button>
          <button onClick={() => setOpen((o) => !o)} className="text-xs text-accent underline">
            {open ? 'Hide notes' : 'Notes'}
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-3">
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input"
          />
          <button
            onClick={() => onAct(() => saveNotes(statute, notes, adminEmail))}
            className="mt-2 rounded-md bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            Save notes
          </button>
        </div>
      )}
    </div>
  );
}
