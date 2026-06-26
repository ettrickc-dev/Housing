import {
  OFFICIAL_LINKS, NYC_HOUSING_COURTS, OUTSIDE_NYC_GUIDANCE,
} from '../lib/courts.js';
import Disclaimer from '../components/Disclaimer.jsx';

export default function Courts() {
  return (
    <main className="mx-auto max-w-prose px-4 py-10">
      <h1 className="text-2xl font-bold text-navy">Court &amp; clerk directory</h1>
      <p className="mt-1 text-sm text-gray-600">
        Where to file your landlord-tenant papers in New York.
      </p>

      <div className="mt-4 rounded-md border border-deadline bg-warnbanner px-4 py-3 text-sm text-navy">
        <strong>Always confirm before you go.</strong> Court locations, hours, and
        filing procedures change. Verify the current address and rules on the{' '}
        <a href={OFFICIAL_LINKS.courtLocator} target="_blank" rel="noreferrer" className="underline">
          official New York courts website
        </a>{' '}
        before filing or appearing.
      </div>

      {/* NYC */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy">New York City — Housing Court</h2>
        <p className="mt-1 text-sm text-gray-600">
          NYC landlord-tenant cases are heard in the Civil Court of the City of New York,
          Housing Part, in the borough where the property is located.
        </p>
        <ul className="mt-3 space-y-2">
          {NYC_HOUSING_COURTS.map((c) => (
            <li key={c.borough} className="rounded-md border border-gray-200 p-3 text-sm">
              <span className="font-semibold text-navy">{c.borough}</span>{' '}
              <span className="text-gray-400">({c.county} County)</span>
              <div className="text-gray-700">{c.address}</div>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          More info:{' '}
          <a href={OFFICIAL_LINKS.nycHousing} target="_blank" rel="noreferrer" className="underline">
            NYC Housing Court
          </a>
        </p>
      </section>

      {/* Outside NYC */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-navy">Outside New York City</h2>
        <p className="mt-2 text-sm text-gray-700">{OUTSIDE_NYC_GUIDANCE.intro}</p>
        <p className="mt-2 text-sm text-gray-700">{OUTSIDE_NYC_GUIDANCE.howToFind}</p>
        <ul className="mt-3 space-y-1 text-sm">
          {OUTSIDE_NYC_GUIDANCE.examplesByRegion.map((e) => (
            <li key={e.region} className="rounded-md border border-gray-200 p-3">
              <span className="font-semibold text-navy">{e.region}</span> — {e.note}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-500">
          Find your court:{' '}
          <a href={OFFICIAL_LINKS.courtLocator} target="_blank" rel="noreferrer" className="underline">
            NY court locator
          </a>{' '}
          ·{' '}
          <a href={OFFICIAL_LINKS.courtHelp} target="_blank" rel="noreferrer" className="underline">
            CourtHelp self-help
          </a>
        </p>
      </section>

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}
