import { Link } from 'react-router-dom';
import { LEGAL_DISCLAIMER } from '../lib/constants.js';
import { ANCHOR } from '../lib/pricing.js';
import { useSeo } from '../lib/useSeo.js';

// Professional, confidence-building landing page. Authoritative tone WITHOUT
// implying any government/court affiliation (we are an independent self-help service).
export default function Landing() {
  const go = '/start'; // public — build & preview before signing up

  useSeo({
    title: 'New York Housing Court Forms — Eviction & Tenant Documents | PlainRights Court',
    description:
      'Prepare New York landlord-tenant court documents in plain English — rent demands, eviction petitions, tenant answers, and more. Free to build and preview; deadlines calculated for you.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: LANDING_FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  });

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

      {/* Free guides (SEO + funnel) */}
      <section className="mx-auto max-w-5xl px-4 py-10 text-center">
        <h2 className="text-2xl font-bold text-navy">New to housing court? Start with a free guide</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
          Plain-English walkthroughs of the New York eviction process — for landlords and tenants.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/guides/how-to-evict-a-tenant-in-new-york" className="rounded-md border border-gray-300 px-4 py-2 text-sm text-navy hover:border-accent">
            How to evict a tenant in NY
          </Link>
          <Link to="/guides/how-to-respond-to-an-eviction-notice-in-new-york" className="rounded-md border border-gray-300 px-4 py-2 text-sm text-navy hover:border-accent">
            How to respond to an eviction
          </Link>
          <Link to="/forms" className="rounded-md border border-gray-300 px-4 py-2 text-sm text-navy hover:border-accent">
            Browse all forms
          </Link>
          <Link to="/efile" className="rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent hover:bg-blue-50">
            File online — skip the line
          </Link>
        </div>
      </section>

      {/* FAQ (also emitted as structured data for Google) */}
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h2 className="text-center text-2xl font-bold text-navy">Frequently asked questions</h2>
        <dl className="mt-6 space-y-5">
          {LANDING_FAQ.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-navy">{f.q}</dt>
              <dd className="mt-1 text-sm text-gray-700">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Trust / disclaimer */}
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-navy">Please read — what this service is</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{LEGAL_DISCLAIMER}</p>
        </div>
      </section>
    </div>
  );
}

const LANDING_FAQ = [
  { q: 'Do I have to pay before I see my document?', a: 'No. You can build and preview your entire document for free. You only pay when you download the final, watermark-free copy to file.' },
  { q: 'Is PlainRights Court a law firm?', a: 'No. We are an independent document-preparation and legal-education service — not a law firm, not the court, and not a substitute for a lawyer. We do not give legal advice.' },
  { q: 'Will the court accept my document?', a: 'Documents are prepared from publicly available New York law and court forms, with filing instructions included. You stay in control and should confirm current requirements for your court; many self-represented people file successfully.' },
  { q: "What if I don't know all the details, like the tenant's full name?", a: 'You can use "John Doe" or "Jane Doe" for unknown occupants, and every field has a plain-English example showing what to write.' },
  { q: 'How much does it cost?', a: 'Single documents start around $25, or you can get unlimited documents with a monthly or annual subscription. An attorney typically charges $500+ for the same paperwork.' },
];

function Badge({ children }) {
  return <span className="whitespace-nowrap">{children}</span>;
}

const COMPARISON = [
  { label: 'Walks you through filing ONLINE (NYSCEF) — file from home, skip the hours-long line', free: false },
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
