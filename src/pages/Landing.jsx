import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext.jsx';
import { LEGAL_DISCLAIMER } from '../lib/constants.js';
import { ANCHOR } from '../lib/pricing.js';

// Professional, confidence-building landing page. Authoritative tone WITHOUT
// implying any government/court affiliation (we are an independent self-help service).
export default function Landing() {
  const { user } = useAuth();
  const go = user ? '/start' : '/login';

  return (
    <div>
      {/* Trust strip */}
      <div className="border-b border-gray-200 bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-2 text-center text-xs sm:text-sm">
          New York State landlord–tenant court documents · Plain-English, step-by-step
          preparation · <span className="text-gray-300">Independent self-help service — not a law firm or government agency</span>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-panel to-white">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            New York Housing Court · Eviction &amp; Tenant Forms
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold leading-tight text-navy sm:text-5xl">
            Housing court papers, prepared correctly — in plain English.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Whether you're a landlord starting a case or a tenant responding to one,
            PlainRights Court guides you question-by-question, fills the forms from your
            answers, calculates your deadlines, and produces court-ready PDFs with filing
            instructions.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-700">
            Attorneys charge <strong>${ANCHOR.attorneyMin}+</strong> and prep services up to{' '}
            <strong>${ANCHOR.serviceMax}</strong>. Prepare yours <strong>from $25</strong> —
            and it's <strong>free to build and preview</strong> before you pay.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6">
            <Link
              to={go}
              className="group rounded-xl border-2 border-navy bg-white p-6 text-left transition hover:bg-navy hover:text-white"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-accent group-hover:text-white">
                Property owners
              </div>
              <div className="mt-1 text-xl font-bold">I'm a landlord</div>
              <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-200">
                Rent demands, termination &amp; cure notices, nonpayment &amp; holdover
                petitions, affidavits of service.
              </p>
            </Link>
            <Link
              to={go}
              className="group rounded-xl border-2 border-navy bg-white p-6 text-left transition hover:bg-navy hover:text-white"
            >
              <div className="text-xs font-semibold uppercase tracking-wide text-accent group-hover:text-white">
                Renters &amp; occupants
              </div>
              <div className="mt-1 text-xl font-bold">I'm a tenant</div>
              <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-200">
                Answers with built-in defenses, orders to show cause, emergency relief.
              </p>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <Badge>✓ Deadline calculators</Badge>
            <Badge>✓ Plain-language questions</Badge>
            <Badge>✓ Court-ready PDFs + filing steps</Badge>
            <Badge>✓ Saved &amp; reusable</Badge>
          </div>
        </div>
      </section>

      {/* Why us vs the free court forms */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold text-navy">
          Better than filling out the blank PDFs yourself
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600">
          The courts publish free blank forms — but you're on your own to understand
          them, fill every field, count deadlines, and figure out what to file next.
          PlainRights Court does the heavy lifting.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-panel text-left text-navy">
                <th className="px-4 py-3 font-semibold">What you get</th>
                <th className="px-4 py-3 text-center font-semibold">Free blank forms</th>
                <th className="px-4 py-3 text-center font-semibold text-accent">PlainRights Court</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {COMPARISON.map((row) => (
                <tr key={row.label}>
                  <td className="px-4 py-3 text-gray-700">{row.label}</td>
                  <td className="px-4 py-3 text-center text-gray-400">{row.free ? '✓' : '—'}</td>
                  <td className="px-4 py-3 text-center font-medium text-green-700">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center">
          <Link to={go} className="inline-block rounded-md bg-accent px-6 py-3 font-medium text-white hover:bg-blue-700">
            Get started — free to begin
          </Link>
          <p className="mt-2 text-xs text-gray-500">
            Create your documents free; pay only when you download a final, filing-ready copy.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-200 bg-panel">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-center text-2xl font-bold text-navy">How it works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-semibold text-navy">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / disclaimer */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-navy">Please read — what this service is</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{LEGAL_DISCLAIMER}</p>
        </div>
      </section>
    </div>
  );
}

function Badge({ children }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

const COMPARISON = [
  { label: 'Plain-English questions (no legal jargon)', free: false },
  { label: 'Auto-fills your info across every document', free: false },
  { label: 'Calculates your service & filing deadlines', free: false },
  { label: 'Tells you exactly what to do next (and where to file)', free: false },
  { label: 'Built-in defenses & examples so you know what to write', free: false },
  { label: 'Saves your work and documents to come back to', free: false },
  { label: 'Email reminders before deadlines', free: false },
  { label: 'Official statutory citations on each document', free: true },
];

const STEPS = [
  { title: 'Tell us your situation', body: 'A few plain-language questions: landlord or tenant, where you are, and what you need to do.' },
  { title: 'Answer simple questions', body: 'We show only the form you need, with examples for every field and your deadlines calculated for you.' },
  { title: 'Download & file', body: 'Get a court-ready PDF with a step-by-step filing and service instruction sheet attached.' },
];
