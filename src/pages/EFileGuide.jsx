import { Link } from 'react-router-dom';
import { WHY_EFILE, NYC_STEPS, OUTSIDE_STEPS, NYSCEF_URL } from '../lib/efile.js';
import { useSeo } from '../lib/useSeo.js';
import Disclaimer from '../components/Disclaimer.jsx';

export default function EFileGuide() {
  useSeo({
    title: 'File Your NY Eviction Case Online (NYSCEF) — Skip the Line | PlainRights Court',
    description:
      'How to e-file your New York landlord-tenant case from home through NYSCEF instead of waiting hours at the courthouse. Step-by-step for NYC and outside NYC.',
  });

  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">New York Housing Court</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">File your case online — skip the courthouse line</h1>
      <p className="mt-3 text-gray-700">
        In New York City, landlord-tenant cases are now filed electronically through
        NYSCEF (the New York State Courts Electronic Filing system). That means you can
        file from home instead of taking time off, traveling to the courthouse, and
        waiting in line — sometimes for hours, often more than once. We walk you through it.
      </p>

      <div className="mt-6 rounded-lg border border-accent bg-blue-50 p-5">
        <h2 className="font-semibold text-navy">Why file online?</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
          {WHY_EFILE.map((w, i) => <li key={i} className="flex gap-2"><span className="text-green-600">✓</span><span>{w}</span></li>)}
        </ul>
      </div>

      <Steps title="Filing in New York City (NYSCEF)" steps={NYC_STEPS} />

      <div className="mt-4 text-center">
        <a href={NYSCEF_URL} target="_blank" rel="noreferrer"
          className="inline-block rounded-md bg-accent px-6 py-3 font-medium text-white hover:bg-blue-700">
          Open NYSCEF to file →
        </a>
        <p className="mt-2 text-xs text-gray-500">Have your generated PDFs ready to upload.</p>
      </div>

      <Steps title="Filing outside New York City" steps={OUTSIDE_STEPS} />

      <div className="mt-8 rounded-md bg-warnbanner px-4 py-3 text-sm text-navy">
        <strong>Remember:</strong> the Notice of Petition and the Petition must be filed
        <strong> together</strong> to start your case. E-filing rules and steps change —
        confirm the current process for your court on the official NYSCEF site before filing.
      </div>

      <p className="mt-8 text-sm">
        Need the documents first?{' '}
        <Link to="/start" className="text-accent underline">Build your petition</Link>.
      </p>

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}

function Steps({ title, steps }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-navy">{title}</h2>
      <ol className="mt-3 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="font-medium text-navy">{s.h}</p>
              <p className="mt-0.5 text-sm text-gray-700">{s.b}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
