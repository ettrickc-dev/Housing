import { Link } from 'react-router-dom';
import { useSeo } from '../lib/useSeo.js';

// Focused, outcome-driven NY Housing Court homepage. Routes every entry point
// straight into the correct document interview (build-before-signup).
export default function Landing() {
  useSeo({
    title: "Don't Guess Your Way Through Housing Court | PlainRights Court",
    description:
      'Prepare the right New York eviction or tenant documents in minutes. Answer simple questions; we prepare the paperwork, calculate deadlines, and show you exactly what and where to file — including filing online on NYSCEF.',
  });

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-b from-panel to-white">
        <div className="mx-auto max-w-4xl px-4 pb-10 pt-12 text-center sm:pt-16">
          <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">
            Don't Guess Your Way Through Housing Court.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700">
            Prepare the right New York eviction or tenant documents in minutes. Answer
            simple questions. We'll prepare the paperwork, calculate your deadlines,
            explain exactly what to file, and show you where to file it.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/start"
              className="w-full rounded-lg bg-accent px-8 py-4 text-lg font-bold text-white shadow-md hover:bg-blue-700 sm:w-auto"
            >
              Start Free
            </Link>
            <a
              href="#how-it-works"
              className="w-full rounded-lg border-2 border-navy px-8 py-4 text-lg font-semibold text-navy hover:bg-navy hover:text-white sm:w-auto"
            >
              See How It Works
            </a>
          </div>

          {/* Trust bar (honest — no fabricated ratings) */}
          <p className="mt-5 text-sm text-gray-500">
            No legal jargon · Court-ready PDFs · Free to preview · Built for New York Housing Court
          </p>

          {/* Situation selector — outcome-based */}
          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">I'm trying to…</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {SITUATIONS.map((s) => (
                <Link
                  key={s.label}
                  to={s.to}
                  className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
                >
                  <span className="text-2xl" aria-hidden>{s.icon}</span>
                  <span className="text-sm font-semibold text-navy">{s.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT HAPPENED? interactive router ===== */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-navy">What happened?</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Pick the one that fits. We'll take you straight to the right document — no menus, no searching.
        </p>
        <div className="mt-6 space-y-3">
          {WHAT_HAPPENED.map((w) => (
            <Link
              key={w.label}
              to={w.to}
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:border-accent hover:bg-blue-50"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-accent">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-accent" />
                </span>
                <span className="font-medium text-navy">{w.label}</span>
              </span>
              <span className="text-gray-300 group-hover:text-accent">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEAR / URGENCY ===== */}
      <section className="border-y border-gray-200 bg-navy text-white">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Don't let paperwork mistakes delay your case.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-200">
            One incorrect notice or missed deadline could force you to start over.
            PlainRights prepares the paperwork correctly and tells you exactly what comes next.
          </p>
        </div>
      </section>

      {/* ===== PROCESS VISUALIZATION ===== */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-navy">What you'll get</h2>
        <Timeline steps={PROCESS} />
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="bg-panel">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold text-navy">DIY, an attorney, or PlainRights?</h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="px-3 py-3 text-left font-semibold">Feature</th>
                  <th className="px-3 py-3 text-center font-semibold">DIY</th>
                  <th className="px-3 py-3 text-center font-semibold">Attorney</th>
                  <th className="px-3 py-3 text-center font-semibold text-amber-300">PlainRights</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON.map((r) => (
                  <tr key={r.f}>
                    <td className="px-3 py-3 text-gray-700">{r.f}</td>
                    <Cell v={r.diy} />
                    <Cell v={r.atty} />
                    <Cell v={r.pr} highlight />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FILE ONLINE (NYSCEF) ===== */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-navy">File online — save hours, even days</h2>
        <p className="mx-auto mt-3 max-w-2xl text-gray-700">
          In New York City, housing-court cases are filed online through NYSCEF. Instead of
          taking off work, traveling to the courthouse, and waiting in line — sometimes
          twice — you can file from home. We walk you through every step.
        </p>
        <Link to="/efile" className="mt-5 inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-blue-700">
          See how to file online →
        </Link>
      </section>

      {/* ===== WHAT HAPPENS NEXT ===== */}
      <section className="border-t border-gray-200 bg-panel">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold text-navy">What happens next</h2>
          <Timeline steps={NEXT} compact />
          <p className="mt-6 text-sm font-medium text-gray-600">
            People buy certainty. We give you the full path.
          </p>
        </div>
      </section>

      {/* ===== WHAT WE SUPPORT / COMING SOON ===== */}
      <section className="bg-panel">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold text-navy">What you can prepare today</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We focus on New York Housing Court and add forms regularly. Here's what's ready now.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card">
              <p className="font-semibold text-navy">✅ Available now</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {READY_DOCS.map((d) => <li key={d}>• {d}</li>)}
              </ul>
            </div>
            <div className="card">
              <p className="font-semibold text-navy">🔜 Coming soon</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-500">
                {SOON_DOCS.map((d) => <li key={d}>• {d}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST ===== */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-center text-2xl font-bold text-navy">Why people trust PlainRights</h2>
        <ul className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
          {TRUST.map((t) => (
            <li key={t} className="flex gap-2 text-sm text-gray-700">
              <span className="text-green-600">✓</span><span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== PRICING LANGUAGE + CTA ===== */}
      <section className="border-t border-gray-200">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold text-navy">Prepare your paperwork free.</h2>
          <p className="mt-2 text-gray-700">Pay only when you're ready to download.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/start" className="w-full rounded-lg bg-accent px-8 py-4 text-lg font-bold text-white hover:bg-blue-700 sm:w-auto">
              Start Free
            </Link>
            <Link to="/pricing" className="w-full rounded-lg border-2 border-navy px-8 py-4 text-lg font-semibold text-navy hover:bg-navy hover:text-white sm:w-auto">
              See Pricing
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            New to housing court?{' '}
            <Link to="/guides" className="text-accent underline">Read a free step-by-step guide</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}

// Horizontal on desktop, vertical on mobile.
function Timeline({ steps, compact }) {
  return (
    <ol className="mt-8 flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-center">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-3 md:flex-col md:gap-2 md:text-center">
          <span className={`flex ${compact ? 'h-9 w-9' : 'h-11 w-11'} shrink-0 items-center justify-center rounded-full bg-navy font-bold text-white`}>
            {i + 1}
          </span>
          <span className="text-sm font-medium text-navy md:max-w-[7rem]">{s}</span>
          {i < steps.length - 1 && <span className="ml-auto text-gray-300 md:ml-0">→</span>}
        </li>
      ))}
    </ol>
  );
}

function Cell({ v, highlight }) {
  return (
    <td className={`px-3 py-3 text-center ${highlight ? 'bg-amber-50 font-semibold' : ''}`}>
      <span className={v ? 'text-green-600' : 'text-gray-300'}>{v ? '✓' : '✕'}</span>
    </td>
  );
}

const SITUATIONS = [
  { icon: '🏠', label: 'Remove a Tenant', to: '/document/notice_termination' },
  { icon: '💰', label: 'Collect Unpaid Rent', to: '/document/rent_demand_14day' },
  { icon: '📄', label: 'Respond to an Eviction', to: '/document/answer_nonpayment' },
  { icon: '⚖️', label: 'Stop an Eviction', to: '/document/osc_vacate_default' },
  { icon: '🚪', label: 'Start a Holdover Case', to: '/document/holdover_petition' },
  { icon: '⏰', label: 'File Before My Deadline', to: '/start' },
];

const WHAT_HAPPENED = [
  { label: "Tenant didn't pay rent", to: '/document/rent_demand_14day' },
  { label: 'Lease expired', to: '/document/notice_termination' },
  { label: 'Tenant violated the lease', to: '/document/notice_cure_10day' },
  { label: 'I received eviction papers', to: '/document/answer_nonpayment' },
  { label: 'I need emergency court relief', to: '/document/osc_vacate_default' },
  { label: "I don't know", to: '/start' },
];

const PROCESS = ['Notice', 'Petition', 'Affidavit of Service', 'Court Packet', 'Filing Guide', 'Done'];
const NEXT = ['Answer questions', 'Download', 'Print', 'Serve', 'File', 'Court'];

const COMPARISON = [
  { f: 'Knows the correct forms', diy: false, atty: true, pr: true },
  { f: 'Calculates your deadlines', diy: false, atty: true, pr: true },
  { f: 'Step-by-step filing instructions', diy: false, atty: true, pr: true },
  { f: 'Walks you through filing online (NYSCEF)', diy: false, atty: false, pr: true },
  { f: 'Under $50', diy: true, atty: false, pr: true },
  { f: 'Available tonight', diy: true, atty: false, pr: true },
];

const READY_DOCS = [
  '14-Day Rent Demand (bilingual + §235-e notice)',
  '10-Day Notice to Cure',
  '30/60/90-Day Notice of Termination',
  'Nonpayment Petition + Notice of Petition',
  'Holdover Petition + Notice of Petition',
  'Affidavit of Service',
  'Tenant Answer (nonpayment & holdover) with defenses',
  'Order to Show Cause — vacate a default or stay an eviction',
  'Jury demand & fee-waiver (poor person) application',
  'HP repairs case & illegal-lockout (restoration) petitions',
];
const SOON_DOCS = [
  'Motions (default judgment, stipulations)',
  'DHCR filings (registration, lease renewal)',
  'Post-judgment (marshal instructions, satisfaction)',
];

const TRUST = [
  'Based on official New York court forms',
  'Plain-English guidance — no jargon',
  'Built for New York Housing Court',
  'Free preview before you pay',
  'Secure document storage in your account',
  'Built by a New York attorney who knows Housing Court procedures',
];
