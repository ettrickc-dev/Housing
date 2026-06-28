import { Link } from 'react-router-dom';
import { GUIDES } from '../lib/guidesContent.js';
import { useSeo } from '../lib/useSeo.js';
import Disclaimer from '../components/Disclaimer.jsx';

export default function GuidesIndex() {
  useSeo({
    title: 'New York Eviction & Tenant Guides | PlainRights Court',
    description:
      'Plain-English guides to New York housing court: how to evict a tenant, how to respond to an eviction case, deadlines, and where to file.',
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-navy">New York housing court guides</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Free, plain-English guides to the New York eviction process — for landlords and
        tenants. When you're ready, build the matching court document in minutes.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link
              to={`/guides/${g.slug}`}
              className="block h-full rounded-lg border border-gray-200 p-4 hover:border-accent"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                {g.audience}
              </span>
              <span className="mt-1 block font-semibold text-navy">{g.h1}</span>
              <span className="mt-1 block text-sm text-gray-600">{g.metaDescription}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Disclaimer variant="footer" />
      </div>
    </main>
  );
}
